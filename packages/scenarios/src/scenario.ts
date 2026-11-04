import {
  Api,
  CommandFailed,
  type Environment,
  type Repository,
  Workspace,
  WorkspaceExists,
  WorkspaceNotFound,
} from "@possibilities/contract";
import { type Duration, Effect, Ref } from "effect";

export type Scenario = {
  readonly environment: Environment;
  readonly repositories: ReadonlyArray<Repository>;
  readonly workspaces: ReadonlyArray<Workspace>;
  readonly failing?: {
    readonly repositories?: CommandFailed;
    readonly createWorkspace?: CommandFailed;
  };
  readonly latency?: Duration.Input;
};

export const handlers = (scenario: Scenario) =>
  Api.toLayer(
    Effect.gen(function* () {
      const workspaces = yield* Ref.make(scenario.workspaces);

      const respond = <A, E>(effect: Effect.Effect<A, E>) =>
        Effect.delay(effect, scenario.latency ?? 0);

      const moveToFront = (id: string) =>
        Ref.modify(workspaces, (list) => {
          const workspace = list.find((candidate) => candidate.id === id);
          if (!workspace) return [undefined, list];
          return [workspace, [workspace, ...list.filter((other) => other !== workspace)]];
        });

      return Api.of({
        environment: () => respond(Effect.succeed(scenario.environment)),
        repositories: () =>
          respond(
            scenario.failing?.repositories
              ? Effect.fail(scenario.failing.repositories)
              : Effect.succeed(scenario.repositories),
          ),
        workspaces: () => respond(Ref.get(workspaces)),
        openWorkspace: ({ id }) =>
          respond(
            Effect.gen(function* () {
              const workspace = yield* moveToFront(id);
              if (!workspace) {
                return yield* new WorkspaceNotFound({ message: `No workspace with id ${id}` });
              }
              return workspace;
            }),
          ),
        createWorkspace: ({ title, repository: choice }) =>
          respond(
            Effect.gen(function* () {
              const owner = scenario.environment.githubLogin;
              if (choice._tag === "New" && !owner) {
                return yield* new CommandFailed({ message: "gh: not logged in" });
              }
              const repository =
                choice._tag === "Existing" ? choice.nameWithOwner : `${owner}/${choice.name}`;
              const existing = yield* Ref.get(workspaces);
              if (existing.some((workspace) => workspace.repository === repository)) {
                return yield* new WorkspaceExists({
                  message: `${repository} is already a workspace`,
                });
              }
              if (scenario.failing?.createWorkspace) return yield* scenario.failing.createWorkspace;

              const workspace = Workspace.make({ id: crypto.randomUUID(), title, repository });
              yield* Ref.update(workspaces, (list) => [workspace, ...list]);
              return workspace;
            }),
          ),
      });
    }),
  );
