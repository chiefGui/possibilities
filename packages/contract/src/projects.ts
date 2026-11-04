import { Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";

import { CommandFailed } from "./command.ts";
import { WorkspaceNotFound } from "./workspaces.ts";

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

export class ProjectNotFound extends Schema.TaggedError<ProjectNotFound>()("ProjectNotFound", {
  message: Schema.String,
}) {}

export const ProjectsApi = RpcGroup.make(
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
