import { type CreateWorkspace, Workspace } from "@possibilities/contract";
import { Context, Effect, FileSystem, Path, Semaphore } from "effect";

import { clone, commit, createRepository } from "./github.ts";
import { manifestFile, readManifest, writeManifest } from "./manifest.ts";
import { alreadyWorkspace, Registry } from "./registry.ts";
import { sync } from "./sync.ts";

export class ClonesDirectory extends Context.Service<ClonesDirectory, string>()(
  "ClonesDirectory",
) {}

export const gitLock = Semaphore.makeUnsafe(1);

const cloneRoot = Effect.fn("cloneRoot")(function* (repository: string) {
  const path = yield* Path.Path;
  return path.join(yield* ClonesDirectory, repository);
});

export const workspaceRoot = Effect.fn("workspaceRoot")(function* (id: string) {
  const registry = yield* Registry;
  const workspace = yield* registry.get(id);
  return yield* cloneRoot(workspace.repository);
});

export const openWorkspace = Effect.fn("openWorkspace")(function* (id: string) {
  const registry = yield* Registry;
  const fs = yield* FileSystem.FileSystem;
  const workspace = yield* registry.open(id);
  const root = yield* cloneRoot(workspace.repository);
  if (!(yield* fs.exists(root).pipe(Effect.orDie))) yield* clone(workspace.repository, root);
  return workspace;
}, gitLock.withPermits(1));

export const syncWorkspace = Effect.fn("syncWorkspace")(function* (id: string) {
  return yield* sync(yield* workspaceRoot(id));
}, gitLock.withPermits(1));

export const createWorkspace = Effect.fn("createWorkspace")(function* ({
  title,
  repository: choice,
}: CreateWorkspace) {
  const registry = yield* Registry;
  const fs = yield* FileSystem.FileSystem;

  const repository =
    choice._tag === "Existing" ? choice.nameWithOwner : `${choice.owner}/${choice.name}`;
  if (yield* registry.has(repository)) return yield* alreadyWorkspace(repository);
  if (choice._tag === "New") yield* createRepository(repository);

  const root = yield* cloneRoot(repository);

  return yield* Effect.gen(function* () {
    yield* fs.remove(root, { recursive: true, force: true }).pipe(Effect.orDie);
    yield* clone(repository, root);

    const document = yield* readManifest(root).pipe(
      Effect.map(({ document, manifest }) => ({ ...document, id: manifest.id })),
      Effect.orElseSucceed(() => ({ id: crypto.randomUUID() })),
    );
    yield* writeManifest(root, { ...document, title });
    yield* commit(root, "Create workspace", [manifestFile]);

    const workspace = Workspace.make({ id: document.id, title, repository });
    yield* registry.add(workspace);
    return workspace;
  }).pipe(
    Effect.onError(() => fs.remove(root, { recursive: true, force: true }).pipe(Effect.ignore)),
  );
});
