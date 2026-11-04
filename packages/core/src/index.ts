import { Api } from "@possibilities/contract";
import { Effect, Layer } from "effect";

import { environment, repositories } from "./github.ts";
import { Registry } from "./registry.ts";
import { createWorkspace } from "./workspaces.ts";

const handlers = Api.toLayer(
  Effect.gen(function* () {
    const registry = yield* Registry;
    return Api.of({
      environment: () => environment,
      repositories: () => repositories,
      workspaces: () => registry.list,
      openWorkspace: ({ id }) => registry.open(id),
      createWorkspace: (payload) => createWorkspace(payload),
    });
  }),
);

export const layer = (directory: string) => handlers.pipe(Layer.provide(Registry.layer(directory)));
