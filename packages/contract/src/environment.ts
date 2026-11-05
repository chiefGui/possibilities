import { Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";

export const Environment = Schema.Struct({
  git: Schema.Boolean,
  gitIdentity: Schema.Boolean,
  gh: Schema.Boolean,
  githubLogin: Schema.NullOr(Schema.String),
});
export type Environment = typeof Environment.Type;

export const EnvironmentApi = RpcGroup.make(Rpc.make("environment", { success: Environment }));
