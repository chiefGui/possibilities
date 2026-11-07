import { Effect, FileSystem, Path, Schema } from "effect";
import { parse, stringify } from "smol-toml";

export const appDirectory = ".possibilities";
export const manifestFile = `${appDirectory}/workspace.toml`;
export const documentExtension = ".md";

export const documentsPathspec = [
  `:(top,glob)${appDirectory}/**/*${documentExtension}`,
  `:(top,exclude,glob)${appDirectory}/**/.*`,
  `:(top,exclude,glob)${appDirectory}/**/.*/**`,
];

const Manifest = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
});

const decodeManifest = Schema.decodeUnknownEffect(Manifest);

export const readManifest = Effect.fn("readManifest")(function* (root: string) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const toml = yield* fs.readFileString(path.join(root, manifestFile));
  const document = yield* Effect.try(() => parse(toml));
  return { document, manifest: yield* decodeManifest(document) };
});

export const writeManifest = Effect.fn("writeManifest")(function* (
  root: string,
  document: Record<string, unknown>,
) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const file = path.join(root, manifestFile);
  yield* fs.makeDirectory(path.dirname(file), { recursive: true }).pipe(Effect.orDie);
  yield* fs.writeFileString(file, stringify(document)).pipe(Effect.orDie);
});
