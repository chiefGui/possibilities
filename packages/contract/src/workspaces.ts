import { Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";

import { CommandFailed } from "./command.ts";

export const Workspace = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  repository: Schema.String,
});
export type Workspace = typeof Workspace.Type;

export const RepositoryChoice = Schema.TaggedUnion({
  New: { owner: Schema.String, name: Schema.String },
  Existing: { nameWithOwner: Schema.String },
});
export type RepositoryChoice = typeof RepositoryChoice.Type;

export const CreateWorkspace = Schema.Struct({
  title: Schema.String,
  repository: RepositoryChoice,
});
export type CreateWorkspace = typeof CreateWorkspace.Type;

export class WorkspaceNotFound extends Schema.TaggedError<WorkspaceNotFound>()(
  "WorkspaceNotFound",
  { message: Schema.String },
) {}

export class WorkspaceExists extends Schema.TaggedError<WorkspaceExists>()("WorkspaceExists", {
  message: Schema.String,
}) {}

export const WorkspacesApi = RpcGroup.make(
  Rpc.make("workspaces", { success: Schema.Array(Workspace) }),
  Rpc.make("openWorkspace", {
    payload: { id: Schema.String },
    success: Workspace,
    error: Schema.Union([CommandFailed, WorkspaceNotFound]),
  }),
  Rpc.make("syncWorkspace", {
    payload: { id: Schema.String },
    success: Schema.Boolean,
    error: Schema.Union([CommandFailed, WorkspaceNotFound]),
  }),
  Rpc.make("createWorkspace", {
    payload: CreateWorkspace,
    success: Workspace,
    error: Schema.Union([CommandFailed, WorkspaceExists]),
  }),
);
