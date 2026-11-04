import { Schema } from "effect";

export const Workspace = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  repository: Schema.String,
  path: Schema.String,
});
export type Workspace = typeof Workspace.Type;

export const Repository = Schema.Struct({
  nameWithOwner: Schema.String,
  isPrivate: Schema.Boolean,
});
export type Repository = typeof Repository.Type;

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

const procedure = <I extends Schema.Top, O extends Schema.Top, E extends Schema.Top>(
  input: I,
  output: O,
  error: E,
) => ({ input, output, error });

export const procedures = {
  environment: procedure(Schema.Void, Environment, Schema.Never),
  repositories: procedure(Schema.Void, Schema.Array(Repository), CommandFailed),
  workspaces: procedure(Schema.Void, Schema.Array(Workspace), Schema.Never),
  openWorkspace: procedure(Schema.String, Workspace, WorkspaceNotFound),
  createWorkspace: procedure(
    CreateWorkspace,
    Workspace,
    Schema.Union([CommandFailed, WorkspaceExists]),
  ),
};

export type Procedures = typeof procedures;
export type ProcedureName = keyof Procedures;
export type Input<K extends ProcedureName> = Procedures[K]["input"]["Type"];
export type Output<K extends ProcedureName> = Procedures[K]["output"]["Type"];
export type Failure<K extends ProcedureName> = Procedures[K]["error"]["Type"];

export const isProcedureName = (name: unknown): name is ProcedureName =>
  typeof name === "string" && Object.hasOwn(procedures, name);

export const result = (name: ProcedureName) =>
  Schema.toCodecJson(Schema.Exit(procedures[name].output, procedures[name].error, Schema.Defect()));
