import { type CreateWorkspace, Workspace } from "@possibilities/contract";
import { Context, Effect, FileSystem, Path } from "effect";

import { clone, createRepository } from "./github.ts";
import { readManifest, writeManifest } from "./manifest.ts";
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

  const directory = yield* workspaceDirectory(repository);

  return yield* Effect.gen(function* () {
    yield* fs.remove(directory, { recursive: true, force: true }).pipe(Effect.orDie);
    yield* clone(repository, directory);

    const document = yield* readManifest(directory).pipe(
      Effect.map(({ document, manifest }) => ({ ...document, id: manifest.id })),
      Effect.orElseSucceed(() => ({ id: crypto.randomUUID() })),
    );
    yield* writeManifest(directory, { ...document, title }, "Create workspace");

    const workspace = Workspace.make({ id: document.id, title, repository });
    yield* registry.add(workspace);
    return workspace;
  }).pipe(
    Effect.onError(() =>
      fs.remove(directory, { recursive: true, force: true }).pipe(Effect.ignore),
    ),
  );
});
