import { Workspace, WorkspaceExists, WorkspaceNotFound } from "@possibilities/contract";
import { Context, Effect, Layer, Schema } from "effect";
import { SqlClient } from "effect/sql";

import { migrations } from "./migrations.ts";

export const alreadyWorkspace = (repository: string) =>
  Effect.fail(new WorkspaceExists({ message: `${repository} is already a workspace` }));

const decodeWorkspaces = Schema.decodeUnknownEffect(Schema.Array(Workspace));

export class Registry extends Context.Service<Registry>()("Registry", {
  make: Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    const list = sql`SELECT id, title, repository FROM workspaces ORDER BY opened_at DESC`.pipe(
      Effect.flatMap(decodeWorkspaces),
      Effect.orDie,
    );

    const open = (id: string) =>
      sql`UPDATE workspaces SET opened_at = ${Date.now()} WHERE id = ${id} RETURNING id, title, repository`.pipe(
        Effect.flatMap(decodeWorkspaces),
        Effect.orDie,
        Effect.flatMap(([workspace]) =>
          workspace
            ? Effect.succeed(workspace)
            : Effect.fail(new WorkspaceNotFound({ message: `No workspace with id ${id}` })),
        ),
      );

    const has = (repository: string) =>
      sql`SELECT 1 FROM workspaces WHERE repository = ${repository}`.pipe(
        Effect.map((rows) => rows.length > 0),
        Effect.orDie,
      );

    const add = (workspace: Workspace) =>
      sql`INSERT INTO workspaces ${sql.insert({ ...workspace, opened_at: Date.now() })}`.pipe(
        Effect.catchTag("SqlError", (error) =>
          error.reason._tag === "UniqueViolation"
            ? alreadyWorkspace(workspace.repository)
            : Effect.die(error),
        ),
        Effect.asVoid,
      );

    return { list, open, has, add };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(migrations));
}
