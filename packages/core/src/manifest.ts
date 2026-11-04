import { Project } from "@possibilities/contract";
import { Effect, FileSystem, Path, Schema } from "effect";
import { parse, stringify } from "smol-toml";

import { git } from "./github.ts";

const manifestFile = "workspace.toml";

export const Manifest = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  projects: Schema.Array(Project).pipe(Schema.withDecodingDefaultKey(Effect.succeed([]))),
});
export type Manifest = typeof Manifest.Type;

const decodeManifest = Schema.decodeUnknownEffect(Manifest);

export const readManifest = Effect.fn("readManifest")(function* (directory: string) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const toml = yield* fs.readFileString(path.join(directory, manifestFile));
  const document = yield* Effect.try(() => parse(toml));
  return { document, manifest: yield* decodeManifest(document) };
});

export const writeManifest = Effect.fn("writeManifest")(function* (
  directory: string,
  document: Record<string, unknown>,
  message: string,
) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  yield* fs
    .writeFileString(path.join(directory, manifestFile), stringify(document))
    .pipe(Effect.orDie);
  yield* git(directory, "add", manifestFile);
  if (yield* git(directory, "status", "--porcelain")) {
    yield* git(directory, "commit", "-m", message);
    yield* git(directory, "push", "-u", "origin", "HEAD");
  }
});
