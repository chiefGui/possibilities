import { Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";

import { CommandFailed } from "./command.ts";

export const Repository = Schema.Struct({
  nameWithOwner: Schema.String,
  isPrivate: Schema.Boolean,
});

export const RepositoriesApi = RpcGroup.make(
  Rpc.make("owners", { success: Schema.Array(Schema.String), error: CommandFailed }),
  Rpc.make("repositories", {
    payload: { owner: Schema.String },
    success: Schema.Array(Repository),
    error: CommandFailed,
  }),
);
