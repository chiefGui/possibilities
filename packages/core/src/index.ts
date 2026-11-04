import { Api } from "@possibilities/contract";
import { Effect, Layer } from "effect";

import { environment, repositories } from "./github.ts";
import { Registry } from "./registry.ts";
import { ClonesDirectory, createWorkspace } from "./workspaces.ts";

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

export const layer = (clonesDirectory: string) =>
  handlers.pipe(Layer.provide([Registry.layer, Layer.succeed(ClonesDirectory, clonesDirectory)]));
