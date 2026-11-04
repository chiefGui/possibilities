import { CommandFailed, type Environment, Workspace } from "@possibilities/contract";

import { handlers, type Scenario } from "./scenario";

const setUp: Environment = { git: true, gitIdentity: true, gh: true, githubLogin: "octocat" };

const repositories = [
  { nameWithOwner: "octocat/notes", isPrivate: true },
  { nameWithOwner: "octocat/site", isPrivate: false },
  { nameWithOwner: "octocat/api", isPrivate: true },
  { nameWithOwner: "octocat/dotfiles", isPrivate: false },
  { nameWithOwner: "acme/design-system", isPrivate: true },
  { nameWithOwner: "acme/infra", isPrivate: true },
];

const ready: Scenario = {
  environment: setUp,
  repositories,
  workspaces: [
    Workspace.make({ id: "notes", title: "Notes", repository: "octocat/notes" }),
    Workspace.make({ id: "site", title: "Personal site", repository: "octocat/site" }),
    Workspace.make({
      id: "design-system",
      title: "Design system",
      repository: "acme/design-system",
    }),
  ],
};

const fresh: Scenario = { ...ready, workspaces: [] };

export const scenarios: Record<string, Scenario> = {
  ready,
  fresh,
  bare: {
    ...fresh,
    environment: { git: false, gitIdentity: false, gh: false, githubLogin: null },
  },
  "signed-out": { ...fresh, environment: { ...setUp, githubLogin: null } },
  "repositories-fail": {
    ...fresh,
    failing: {
      repositories: new CommandFailed({
        message: "HTTP 502: Bad Gateway (https://api.github.com/graphql)",
      }),
    },
  },
  "create-fails": {
    ...fresh,
    failing: {
      createWorkspace: new CommandFailed({
        message:
          "fatal: unable to access 'https://github.com/': Could not resolve host: github.com",
      }),
    },
  },
  slow: { ...ready, latency: "1500 millis" },
};

export const layer = (name: string) => {
  if (!Object.hasOwn(scenarios, name)) {
    throw new Error(
      `Unknown scenario "${name}", pick one of: ${Object.keys(scenarios).join(", ")}`,
    );
  }
  return handlers(scenarios[name]);
};
