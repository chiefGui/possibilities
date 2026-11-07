import {
  byDocumentName,
  childOf,
  documentKey,
  DocumentNotFound,
  type DocumentRef,
  DocumentView,
  type FolderRef,
  isWithin,
  nameOf,
  parentOf,
  relocate,
  root,
  segments,
  type WorkspaceRef,
  WriterSettings,
} from "@possibilities/contract";
import { Context, Effect, FiberMap, FileSystem, Layer, Path, Schema } from "effect";
import { SqlClient } from "effect/sql";

import { git } from "./github.ts";
import { appDirectory, documentExtension as extension, documentsPathspec } from "./manifest.ts";
import { migrations } from "./migrations.ts";
import { availableName, untitled } from "./names.ts";
import { gitLock, syncWorkspace, workspaceRoot } from "./workspaces.ts";

const idle = "15 seconds";
const defaultSettings: WriterSettings = { focus: false, typewriter: false };

const fileName = (name: string) => `${name}${extension}`;

const stem = (title: string) => {
  const trimmed = title.trim();
  return trimmed.toLowerCase().endsWith(extension) ? trimmed.slice(0, -extension.length) : trimmed;
};

const isVisible = (segment: string) =>
  segment.length > 0 && !segment.startsWith(".") && !/[\\\p{Cc}]/u.test(segment);

const isDocument = (entry: string) => entry.endsWith(extension) && isVisible(entry);

const lines = (output: string) => output.split("\0").filter(Boolean);

const decodeViews = Schema.decodeUnknownEffect(Schema.Array(DocumentView));

const decodePaths = Schema.decodeUnknownEffect(
  Schema.Array(Schema.Struct({ path: Schema.String })),
);

const decodeSettings = Schema.decodeUnknownEffect(Schema.fromJsonString(WriterSettings));

const missing = (path: string) => new DocumentNotFound({ message: `Nothing at ${path}` });

export class Documents extends Context.Service<Documents>()("Documents", {
  make: Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const flushes = yield* FiberMap.make<string>();
    const unsaved = new Map<string, string>();

    const documentsRoot = (workspaceId: string) =>
      workspaceRoot(workspaceId).pipe(
        Effect.map((repository) => path.join(repository, appDirectory)),
      );

    const folder = Effect.fn("folder")(function* ({ workspaceId, path: target }: FolderRef) {
      const parts = segments(target);
      if (!parts.every(isVisible)) return yield* missing(target);
      const top = yield* documentsRoot(workspaceId);
      return { top, directory: path.join(top, ...parts) };
    });

    const file = Effect.fn("file")(function* (ref: DocumentRef) {
      if (ref.path === root) return yield* missing(ref.path);
      return `${(yield* folder(ref)).directory}${extension}`;
    });

    const entries = (directory: string) =>
      fs.readDirectory(directory).pipe(Effect.orElseSucceed((): Array<string> => []));

    const names = (directory: string) =>
      entries(directory).pipe(
        Effect.map((found) =>
          found.filter(isDocument).map((entry) => entry.slice(0, -extension.length)),
        ),
      );

    const isDirectory = (target: string) =>
      fs.stat(target).pipe(
        Effect.map((info) => info.type === "Directory"),
        Effect.orElseSucceed(() => false),
      );

    const write = (target: string, content: string) => {
      const temp = path.join(
        path.dirname(target),
        `.${path.basename(target)}.${crypto.randomUUID()}`,
      );
      return fs.makeDirectory(path.dirname(target), { recursive: true }).pipe(
        Effect.andThen(fs.writeFileString(temp, content)),
        Effect.andThen(fs.rename(temp, target)),
        Effect.onError(() => fs.remove(temp, { force: true }).pipe(Effect.ignore)),
        Effect.orDie,
      );
    };

    const move = (from: string, to: string) => {
      if (from.toLowerCase() !== to.toLowerCase()) return fs.rename(from, to).pipe(Effect.orDie);
      const through = `${to}.${crypto.randomUUID()}`;
      return fs.rename(from, through).pipe(Effect.andThen(fs.rename(through, to)), Effect.orDie);
    };

    const pruneTree = (directory: string): Effect.Effect<void> =>
      Effect.gen(function* () {
        for (const entry of yield* entries(directory)) {
          const child = path.join(directory, entry);
          if (yield* isDirectory(child)) yield* pruneTree(child);
        }
        if ((yield* entries(directory)).length === 0)
          yield* fs.remove(directory).pipe(Effect.ignore);
      });

    const pruneUp = Effect.fn("pruneUp")(function* (top: string, directory: string) {
      let current = directory;
      while (current !== top && (yield* entries(current)).length === 0) {
        yield* fs.remove(current).pipe(Effect.ignore);
        current = path.dirname(current);
      }
    });

    const schedule = (workspaceId: string) =>
      FiberMap.run(
        flushes,
        workspaceId,
        Effect.sleep(idle).pipe(
          Effect.andThen(syncWorkspace(workspaceId).pipe(Effect.ignore, Effect.uninterruptible)),
        ),
      );

    const change = <A, E, R>(workspaceId: string, effect: Effect.Effect<A, E, R>) =>
      effect.pipe(
        gitLock.withPermits(1),
        Effect.tap(() => schedule(workspaceId)),
      );

    const matching = (ref: DocumentRef) =>
      sql.and([sql`workspace_id = ${ref.workspaceId}`, sql`path = ${ref.path}`]);

    const readView = (ref: DocumentRef) =>
      sql`SELECT anchor, head, top FROM document_views WHERE ${matching(ref)}`.pipe(
        Effect.flatMap(decodeViews),
        Effect.map(([found]) => found ?? null),
        Effect.orDie,
      );

    const viewsWithin = ({ workspaceId, path: target }: FolderRef) =>
      sql`SELECT path FROM document_views WHERE workspace_id = ${workspaceId}`.pipe(
        Effect.flatMap(decodePaths),
        Effect.map((rows) =>
          rows.map((row) => row.path).filter((other) => isWithin(other, target)),
        ),
        Effect.orDie,
      );

    const forgetViews = (workspaceId: string, paths: ReadonlyArray<string>) =>
      paths.length === 0
        ? Effect.void
        : sql`DELETE FROM document_views WHERE workspace_id = ${workspaceId} AND ${sql.in("path", paths)}`.pipe(
            Effect.asVoid,
            Effect.orDie,
          );

    const list = Effect.fn("listDocuments")(function* ({ workspaceId }: WorkspaceRef) {
      const top = yield* documentsRoot(workspaceId);
      const ls = (...flags: ReadonlyArray<string>) =>
        git(top, "ls-files", "-z", ...flags, "--", ...documentsPathspec).pipe(
          Effect.map(lines),
          Effect.orDie,
        );
      const [present, deleted] = yield* Effect.all(
        [ls("--cached", "--others", "--exclude-standard"), ls("--deleted")],
        { concurrency: "unbounded" },
      );
      const gone = new Set(deleted);
      return [...new Set(present)]
        .filter((file) => !gone.has(file) && segments(file).every(isVisible))
        .map((file) => file.slice(0, -extension.length))
        .sort(byDocumentName);
    });

    const read = Effect.fn("readDocument")(function* (ref: DocumentRef) {
      const target = yield* file(ref);
      const pending = unsaved.get(documentKey(ref));
      const content =
        pending ??
        (yield* fs.readFileString(target).pipe(
          Effect.catchReason("PlatformError", "NotFound", () => Effect.fail(missing(ref.path))),
          Effect.catchTag("PlatformError", Effect.die),
        ));
      return { content, view: yield* readView(ref) };
    });

    const create = (ref: FolderRef) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const { directory } = yield* folder(ref);
          const name = availableName(yield* names(directory), untitled);
          yield* write(path.join(directory, fileName(name)), "");
          return childOf(ref.path, name);
        }),
      );

    const save = (ref: DocumentRef, content: string) => {
      const key = documentKey(ref);
      unsaved.set(key, content);
      return change(
        ref.workspaceId,
        file(ref).pipe(Effect.flatMap((target) => write(target, content))),
      ).pipe(
        Effect.ensuring(
          Effect.sync(() => {
            if (unsaved.get(key) === content) unsaved.delete(key);
          }),
        ),
      );
    };

    const saveView = (ref: DocumentRef, { anchor, head, top }: DocumentView) =>
      sql`INSERT INTO document_views ${sql.insert({
        workspace_id: ref.workspaceId,
        path: ref.path,
        anchor,
        head,
        top,
      })} ON CONFLICT (workspace_id, path) DO UPDATE SET anchor = excluded.anchor, head = excluded.head, top = excluded.top`.pipe(
        Effect.asVoid,
        Effect.orDie,
      );

    const retargetView = (workspaceId: string, from: string, to: string) =>
      sql`UPDATE OR REPLACE document_views SET path = ${to} WHERE ${matching({ workspaceId, path: from })}`.pipe(
        Effect.asVoid,
        Effect.orDie,
      );

    const rename = (ref: DocumentRef, title: string) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const target = yield* file(ref);
          const directory = path.dirname(target);
          const name = availableName(yield* names(directory), stem(title), nameOf(ref.path));
          const renamed = childOf(parentOf(ref.path), name);
          if (renamed === ref.path) return renamed;
          yield* move(target, path.join(directory, fileName(name)));
          yield* retargetView(ref.workspaceId, ref.path, renamed);
          return renamed;
        }),
      );

    const remove = (ref: DocumentRef) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const target = yield* file(ref);
          unsaved.delete(documentKey(ref));
          yield* fs.remove(target, { force: true }).pipe(Effect.orDie);
          yield* pruneUp((yield* folder(ref)).top, path.dirname(target));
          yield* forgetViews(ref.workspaceId, [ref.path]);
        }),
      );

    const createFolder = (ref: FolderRef) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const { directory } = yield* folder(ref);
          const name = availableName(yield* entries(directory), untitled);
          yield* write(path.join(directory, name, fileName(untitled)), "");
          return childOf(childOf(ref.path, name), untitled);
        }),
      );

    const renameFolder = (ref: FolderRef, title: string) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const { top, directory } = yield* folder(ref);
          if (directory === top || !(yield* isDirectory(directory)))
            return yield* missing(ref.path);
          const parent = path.dirname(directory);
          const name = availableName(yield* entries(parent), title, nameOf(ref.path));
          const renamed = childOf(parentOf(ref.path), name);
          if (renamed === ref.path) return renamed;
          yield* move(directory, path.join(parent, name));
          for (const view of yield* viewsWithin(ref)) {
            yield* retargetView(ref.workspaceId, view, relocate(view, ref.path, renamed));
          }
          return renamed;
        }),
      );

    const removeFolder = (ref: FolderRef) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const { top, directory } = yield* folder(ref);
          if (directory === top) return yield* missing(ref.path);
          const within = (yield* list(ref)).filter((document) => isWithin(document, ref.path));
          for (const document of within) {
            const target = { workspaceId: ref.workspaceId, path: document };
            unsaved.delete(documentKey(target));
            yield* fs.remove(yield* file(target), { force: true }).pipe(Effect.orDie);
          }
          yield* pruneTree(directory);
          yield* pruneUp(top, path.dirname(directory));
          yield* forgetViews(ref.workspaceId, yield* viewsWithin(ref));
        }),
      );

    const settings = sql<{ value: string }>`SELECT value FROM settings WHERE key = 'writer'`.pipe(
      Effect.orDie,
      Effect.flatMap(([row]) =>
        row
          ? decodeSettings(row.value).pipe(Effect.orElseSucceed(() => defaultSettings))
          : Effect.succeed(defaultSettings),
      ),
    );

    const saveSettings = (value: WriterSettings) =>
      sql`INSERT INTO settings ${sql.insert({ key: "writer", value: JSON.stringify(value) })} ON CONFLICT (key) DO UPDATE SET value = excluded.value`.pipe(
        Effect.asVoid,
        Effect.orDie,
      );

    return {
      list,
      read,
      create,
      save,
      saveView,
      rename,
      remove,
      createFolder,
      renameFolder,
      removeFolder,
      settings,
      saveSettings,
    };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(migrations));
}
