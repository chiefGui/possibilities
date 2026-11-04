import { Effect, Layer } from "effect";
import { Migrator, SqlClient } from "effect/sql";

const migrate = Migrator.make({});

export const migrations = Layer.effectDiscard(
  migrate({
    loader: Migrator.fromRecord({
      "1_workspaces": Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        yield* sql`
          CREATE TABLE workspaces (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            repository TEXT NOT NULL UNIQUE,
            opened_at INTEGER NOT NULL
          )
        `;
      }),
    }),
  }).pipe(Effect.orDie),
);
