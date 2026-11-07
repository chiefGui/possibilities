import { DocumentsApi } from "./documents.ts";
import { EnvironmentApi } from "./environment.ts";
import { ProjectsApi } from "./projects.ts";
import { RepositoriesApi } from "./repositories.ts";
import { WorkspacesApi } from "./workspaces.ts";

export * from "./command.ts";
export * from "./documents.ts";
export * from "./environment.ts";
export * from "./projects.ts";
export * from "./repositories.ts";
export * from "./workspaces.ts";

export const Api = EnvironmentApi.merge(RepositoriesApi, WorkspacesApi, ProjectsApi, DocumentsApi);
