import { Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";

export const Workspace = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  repository: Schema.String,
});
export type Workspace = typeof Workspace.Type;

export const Project = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  codebase: Schema.optionalKey(Schema.String),
});
export type Project = typeof Project.Type;

export const CreateProject = Schema.Struct({
  workspaceId: Schema.String,
  title: Schema.String,
  codebase: Schema.optionalKey(Schema.String),
});
export type CreateProject = typeof CreateProject.Type;

export const RenameProject = Schema.Struct({
  workspaceId: Schema.String,
  id: Schema.String,
  title: Schema.String,
});
export type RenameProject = typeof RenameProject.Type;

export const Repository = Schema.Struct({
  nameWithOwner: Schema.String,
  isPrivate: Schema.Boolean,
});

export const Environment = Schema.Struct({
  git: Schema.Boolean,
  gitIdentity: Schema.Boolean,
  gh: Schema.Boolean,
  githubLogin: Schema.NullOr(Schema.String),
});
export type Environment = typeof Environment.Type;

export const RepositoryChoice = Schema.TaggedUnion({
  New: { name: Schema.String },
  Existing: { nameWithOwner: Schema.String },
});
export type RepositoryChoice = typeof RepositoryChoice.Type;

export const CreateWorkspace = Schema.Struct({
  title: Schema.String,
  repository: RepositoryChoice,
});
export type CreateWorkspace = typeof CreateWorkspace.Type;

export class CommandFailed extends Schema.TaggedError<CommandFailed>()("CommandFailed", {
  message: Schema.String,
}) {}

export class WorkspaceNotFound extends Schema.TaggedError<WorkspaceNotFound>()(
  "WorkspaceNotFound",
  { message: Schema.String },
) {}

export class WorkspaceExists extends Schema.TaggedError<WorkspaceExists>()("WorkspaceExists", {
  message: Schema.String,
}) {}

export class ProjectNotFound extends Schema.TaggedError<ProjectNotFound>()("ProjectNotFound", {
  message: Schema.String,
}) {}

export const Api = RpcGroup.make(
  Rpc.make("environment", { success: Environment }),
  Rpc.make("repositories", { success: Schema.Array(Repository), error: CommandFailed }),
  Rpc.make("workspaces", { success: Schema.Array(Workspace) }),
  Rpc.make("openWorkspace", {
    payload: { id: Schema.String },
    success: Workspace,
    error: WorkspaceNotFound,
  }),
  Rpc.make("createWorkspace", {
    payload: CreateWorkspace,
    success: Workspace,
    error: Schema.Union([CommandFailed, WorkspaceExists]),
  }),
  Rpc.make("projects", {
    payload: { workspaceId: Schema.String },
    success: Schema.Array(Project),
    error: WorkspaceNotFound,
  }),
  Rpc.make("createProject", {
    payload: CreateProject,
    success: Project,
    error: Schema.Union([CommandFailed, WorkspaceNotFound]),
  }),
  Rpc.make("renameProject", {
    payload: RenameProject,
    success: Project,
    error: Schema.Union([CommandFailed, WorkspaceNotFound, ProjectNotFound]),
  }),
);
