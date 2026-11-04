import { type CreateWorkspace, Workspace, WorkspaceExists } from "contract";
import { Effect, FileSystem, Path, Schema } from "effect";

import { clone, createRepository, git, login } from "./github.ts";
import { Registry } from "./registry.ts";

const Manifest = Schema.Struct({ id: Schema.String, title: Schema.String });
const decodeManifest = Schema.decodeUnknownEffect(Schema.fromJsonString(Manifest));

const resolveRepository = (choice: CreateWorkspace["repository"]) =>
  choice._tag === "Existing"
    ? Effect.succeed(choice.nameWithOwner)
    : login.pipe(Effect.map((owner) => `${owner}/${choice.name}`));

export const listWorkspaces = Effect.gen(function* () {
  return yield* (yield* Registry).list;
});

export const openWorkspace = Effect.fn("openWorkspace")(function* (id: string) {
  return yield* (yield* Registry).open(id);
});

export const createWorkspace = Effect.fn("createWorkspace")(function* ({
  title,
  repository: choice,
}: CreateWorkspace) {
  const registry = yield* Registry;
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;

  const repository = yield* resolveRepository(choice);
  if (yield* registry.find(repository)) {
    return yield* new WorkspaceExists({ message: `${repository} is already a workspace` });
  }
  if (choice._tag === "New") yield* createRepository(choice.name);

  const directory = registry.clonePath(repository);
  const manifestPath = path.join(directory, "workspace.json");

  const workspace = yield* Effect.gen(function* () {
    yield* fs.remove(directory, { recursive: true, force: true }).pipe(Effect.orDie);
    yield* clone(repository, directory);

    const existing = yield* fs
      .readFileString(manifestPath)
      .pipe(Effect.flatMap(decodeManifest), Effect.option);
    const manifest = Manifest.make({
      id: existing._tag === "Some" ? existing.value.id : crypto.randomUUID(),
      title,
    });
    yield* fs
      .writeFileString(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
      .pipe(Effect.orDie);

    yield* git(directory, "add", "workspace.json");
    if (yield* git(directory, "status", "--porcelain")) {
      yield* git(directory, "commit", "-m", "Create workspace");
      yield* git(directory, "push", "-u", "origin", "HEAD");
    }

    return Workspace.make({ ...manifest, repository, path: directory });
  }).pipe(
    Effect.onError(() =>
      fs.remove(directory, { recursive: true, force: true }).pipe(Effect.ignore),
    ),
  );

  yield* registry.add(workspace);
  return workspace;
});
