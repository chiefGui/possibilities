import { type CreateWorkspace, Workspace } from "@possibilities/contract";
import { Context, Effect, FileSystem, Path } from "effect";

import { clone, commit, createRepository } from "./github.ts";
import { manifestFile, readManifest, writeManifest } from "./manifest.ts";
import { alreadyWorkspace, Registry } from "./registry.ts";

export class ClonesDirectory extends Context.Service<ClonesDirectory, string>()(
  "ClonesDirectory",
) {}

export const workspaceDirectory = Effect.fn("workspaceDirectory")(function* (repository: string) {
  const path = yield* Path.Path;
  return path.join(yield* ClonesDirectory, repository);
});

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

  const root = yield* workspaceDirectory(repository);

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
