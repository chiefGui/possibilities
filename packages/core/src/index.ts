import { Api } from "@possibilities/contract";
import { Effect, Layer } from "effect";

import { environment, owners, repositories } from "./github.ts";
import { createProject, listProjects, renameProject } from "./projects.ts";
import { Registry } from "./registry.ts";
import { ClonesDirectory, createWorkspace } from "./workspaces.ts";

const handlers = Api.toLayer(
  Effect.gen(function* () {
    const registry = yield* Registry;
    return Api.of({
      environment: () => environment,
      owners: () => owners,
      repositories: ({ owner }) => repositories(owner),
      workspaces: () => registry.list,
      openWorkspace: ({ id }) => registry.open(id),
      createWorkspace,
      projects: ({ workspaceId }) => listProjects(workspaceId),
      createProject,
      renameProject,
    });
  }),
);

export const layer = (clonesDirectory: string) =>
  handlers.pipe(Layer.provide([Registry.layer, Layer.succeed(ClonesDirectory, clonesDirectory)]));
