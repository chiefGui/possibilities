import { Workspace, WorkspaceNotFound } from "contract";
import { Context, Effect, FileSystem, Layer, Path, Schema, Semaphore, Struct } from "effect";

const Entry = Schema.Struct({ ...Workspace.fields, openedAt: Schema.Number });
type Entry = typeof Entry.Type;

const RegistryFile = Schema.fromJsonString(Schema.Array(Entry));
const decode = Schema.decodeUnknownEffect(RegistryFile);
const encode = Schema.encodeEffect(RegistryFile);

const toWorkspace = (entry: Entry): Workspace => Struct.omit(entry, ["openedAt"]);

export class Registry extends Context.Service<Registry>()("Registry", {
  make: (directory: string) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const file = path.join(directory, "workspaces.json");
      const lock = yield* Semaphore.make(1);

      const read = Effect.gen(function* () {
        if (!(yield* fs.exists(file))) return [];
        return yield* decode(yield* fs.readFileString(file));
      }).pipe(Effect.orDie);

      const write = (entries: ReadonlyArray<Entry>) =>
        encode(entries).pipe(
          Effect.flatMap((json) => fs.writeFileString(file, json)),
          Effect.orDie,
        );

      const list = read.pipe(
        Effect.map((entries) =>
          entries.toSorted((a, b) => b.openedAt - a.openedAt).map(toWorkspace),
        ),
      );

      const open = (id: string) =>
        lock.withPermit(
          Effect.gen(function* () {
            const entries = yield* read;
            const entry = entries.find((entry) => entry.id === id);
            if (!entry) {
              return yield* new WorkspaceNotFound({ message: `No workspace with id ${id}` });
            }
            yield* write(
              entries.map((other) =>
                other === entry ? { ...entry, openedAt: Date.now() } : other,
              ),
            );
            return toWorkspace(entry);
          }),
        );

      const find = (repository: string) =>
        read.pipe(
          Effect.map((entries) => entries.find((entry) => entry.repository === repository)),
        );

      const add = (workspace: Workspace) =>
        lock.withPermit(
          read.pipe(
            Effect.flatMap((entries) =>
              write([...entries, { ...workspace, openedAt: Date.now() }]),
            ),
          ),
        );

      const clonePath = (repository: string) => path.join(directory, "workspaces", repository);

      return { list, open, find, add, clonePath };
    }),
}) {
  static readonly layer = (directory: string) => Layer.effect(this, this.make(directory));
}
