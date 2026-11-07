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
      "2_documents": Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        yield* sql`
          CREATE TABLE document_views (
            workspace_id TEXT NOT NULL,
            project_id TEXT NOT NULL,
            name TEXT NOT NULL,
            anchor INTEGER NOT NULL,
            head INTEGER NOT NULL,
            top INTEGER NOT NULL,
            PRIMARY KEY (workspace_id, project_id, name)
          )
        `;
        yield* sql`
          CREATE TABLE settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
          )
        `;
      }),
    }),
  }).pipe(Effect.orDie),
);
