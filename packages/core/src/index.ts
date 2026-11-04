import { Api } from "@possibilities/contract";
import { Layer } from "effect";

import { environment, repositories } from "./github.ts";
import { Registry } from "./registry.ts";
import { createWorkspace, listWorkspaces, openWorkspace } from "./workspaces.ts";

const handlers = Api.toLayer({
  environment: () => environment,
  repositories: () => repositories,
  workspaces: () => listWorkspaces,
  openWorkspace: ({ id }) => openWorkspace(id),
  createWorkspace: (payload) => createWorkspace(payload),
});

export const layer = (directory: string) => handlers.pipe(Layer.provide(Registry.layer(directory)));
