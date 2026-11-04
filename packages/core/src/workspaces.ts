import { type CreateWorkspace, Workspace } from "@possibilities/contract";
import { Context, Effect, FileSystem, Path, Schema } from "effect";
import { parse, stringify } from "smol-toml";

import { clone, createRepository, git, login } from "./github.ts";
import { alreadyWorkspace, Registry } from "./registry.ts";

export class ClonesDirectory extends Context.Service<ClonesDirectory, string>()(
  "ClonesDirectory",
) {}

const manifestFile = "workspace.toml";
const Manifest = Schema.Struct({ id: Schema.String, title: Schema.String });
const decodeManifest = Schema.decodeUnknownEffect(Manifest);

const resolveRepository = (choice: CreateWorkspace["repository"]) =>
  choice._tag === "Existing"
    ? Effect.succeed(choice.nameWithOwner)
    : login.pipe(Effect.map((owner) => `${owner}/${choice.name}`));

export const createWorkspace = Effect.fn("createWorkspace")(function* ({
  title,
  repository: choice,
}: CreateWorkspace) {
  const registry = yield* Registry;
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;

  const repository = yield* resolveRepository(choice);
  if (yield* registry.has(repository)) return yield* alreadyWorkspace(repository);
  if (choice._tag === "New") yield* createRepository(choice.name);

  const directory = path.join(yield* ClonesDirectory, repository);
  const manifestPath = path.join(directory, manifestFile);

  return yield* Effect.gen(function* () {
    yield* fs.remove(directory, { recursive: true, force: true }).pipe(Effect.orDie);
    yield* clone(repository, directory);

    const id = yield* fs.readFileString(manifestPath).pipe(
      Effect.flatMap((toml) => Effect.try(() => parse(toml))),
      Effect.flatMap(decodeManifest),
      Effect.map((existing) => existing.id),
      Effect.orElseSucceed(() => crypto.randomUUID()),
    );
    const manifest = Manifest.make({ id, title });
    yield* fs.writeFileString(manifestPath, stringify(manifest)).pipe(Effect.orDie);

    yield* git(directory, "add", manifestFile);
    if (yield* git(directory, "status", "--porcelain")) {
      yield* git(directory, "commit", "-m", "Create workspace");
      yield* git(directory, "push", "-u", "origin", "HEAD");
    }

    const workspace = Workspace.make({ ...manifest, repository });
    yield* registry.add(workspace);
    return workspace;
  }).pipe(
    Effect.onError(() =>
      fs.remove(directory, { recursive: true, force: true }).pipe(Effect.ignore),
    ),
  );
});
