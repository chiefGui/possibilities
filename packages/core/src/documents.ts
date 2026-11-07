import {
  byDocumentName,
  DocumentNotFound,
  type DocumentRef,
  DocumentView,
  type ProjectRef,
  WriterSettings,
} from "@possibilities/contract";
import { Context, Effect, FiberMap, FileSystem, Layer, Path, Schema } from "effect";
import { SqlClient } from "effect/sql";

import { documentExtension as extension } from "./manifest.ts";
import { migrations } from "./migrations.ts";
import { availableName } from "./names.ts";
import { projectFolder } from "./projects.ts";
import { gitLock, syncWorkspace, workspaceRoot } from "./workspaces.ts";

const idle = "15 seconds";
const defaultSettings: WriterSettings = { focus: false, typewriter: false };

const keyOf = ({ workspaceId, projectId, name }: DocumentRef) =>
  JSON.stringify([workspaceId, projectId, name]);

const fileName = (name: string) => `${name}${extension}`;

const stem = (title: string) => {
  const trimmed = title.trim();
  return trimmed.toLowerCase().endsWith(extension) ? trimmed.slice(0, -extension.length) : trimmed;
};

const isDocument = (entry: string) => entry.endsWith(extension) && !entry.startsWith(".");

const decodeViews = Schema.decodeUnknownEffect(Schema.Array(DocumentView));

const decodeSettings = Schema.decodeUnknownEffect(Schema.fromJsonString(WriterSettings));

export class Documents extends Context.Service<Documents>()("Documents", {
  make: Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const flushes = yield* FiberMap.make<string>();
    const unsaved = new Map<string, string>();

    const folder = Effect.fn("folder")(function* ({ workspaceId, projectId }: ProjectRef) {
      return yield* projectFolder(yield* workspaceRoot(workspaceId), projectId);
    });

    const names = (directory: string) =>
      fs.readDirectory(directory).pipe(
        Effect.map((entries) =>
          entries.filter(isDocument).map((entry) => entry.slice(0, -extension.length)),
        ),
        Effect.orElseSucceed((): Array<string> => []),
      );

    const write = (file: string, content: string) => {
      const temp = path.join(path.dirname(file), `.${path.basename(file)}.${crypto.randomUUID()}`);
      return fs.writeFileString(temp, content).pipe(
        Effect.andThen(fs.rename(temp, file)),
        Effect.onError(() => fs.remove(temp, { force: true }).pipe(Effect.ignore)),
        Effect.orDie,
      );
    };

    const move = (from: string, to: string) => {
      if (from.toLowerCase() !== to.toLowerCase()) return fs.rename(from, to).pipe(Effect.orDie);
      const through = `${to}.${crypto.randomUUID()}`;
      return fs.rename(from, through).pipe(Effect.andThen(fs.rename(through, to)), Effect.orDie);
    };

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
      sql.and([
        sql`workspace_id = ${ref.workspaceId}`,
        sql`project_id = ${ref.projectId}`,
        sql`name = ${ref.name}`,
      ]);

    const readView = (ref: DocumentRef) =>
      sql`SELECT anchor, head, top FROM document_views WHERE ${matching(ref)}`.pipe(
        Effect.flatMap(decodeViews),
        Effect.map(([found]) => found ?? null),
        Effect.orDie,
      );

    const list = Effect.fn("listDocuments")(function* (ref: ProjectRef) {
      return (yield* names(yield* folder(ref))).sort(byDocumentName);
    });

    const read = Effect.fn("readDocument")(function* (ref: DocumentRef) {
      const directory = yield* folder(ref);
      const pending = unsaved.get(keyOf(ref));
      const content =
        pending ??
        (yield* fs.readFileString(path.join(directory, fileName(ref.name))).pipe(
          Effect.catchReason("PlatformError", "NotFound", () =>
            Effect.fail(new DocumentNotFound({ message: `No document named ${ref.name}` })),
          ),
          Effect.catchTag("PlatformError", Effect.die),
        ));
      return { content, view: yield* readView(ref) };
    });

    const create = (ref: ProjectRef) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const directory = yield* folder(ref);
          const name = availableName(yield* names(directory), "Untitled");
          yield* write(path.join(directory, fileName(name)), "");
          return name;
        }),
      );

    const save = (ref: DocumentRef, content: string) => {
      const key = keyOf(ref);
      unsaved.set(key, content);
      return change(
        ref.workspaceId,
        folder(ref).pipe(
          Effect.flatMap((directory) => write(path.join(directory, fileName(ref.name)), content)),
        ),
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
        project_id: ref.projectId,
        name: ref.name,
        anchor,
        head,
        top,
      })} ON CONFLICT (workspace_id, project_id, name) DO UPDATE SET anchor = excluded.anchor, head = excluded.head, top = excluded.top`.pipe(
        Effect.asVoid,
        Effect.orDie,
      );

    const rename = (ref: DocumentRef, title: string) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const directory = yield* folder(ref);
          const name = availableName(yield* names(directory), stem(title), ref.name);
          if (name === ref.name) return name;
          yield* move(
            path.join(directory, fileName(ref.name)),
            path.join(directory, fileName(name)),
          );
          yield* sql`UPDATE OR REPLACE document_views SET name = ${name} WHERE ${matching(ref)}`.pipe(
            Effect.orDie,
          );
          return name;
        }),
      );

    const remove = (ref: DocumentRef) =>
      change(
        ref.workspaceId,
        Effect.gen(function* () {
          const directory = yield* folder(ref);
          unsaved.delete(keyOf(ref));
          yield* fs
            .remove(path.join(directory, fileName(ref.name)), { force: true })
            .pipe(Effect.orDie);
          yield* sql`DELETE FROM document_views WHERE ${matching(ref)}`.pipe(Effect.orDie);
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

    return { list, read, create, save, saveView, rename, remove, settings, saveSettings };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(migrations));
}
