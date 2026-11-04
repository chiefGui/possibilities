import type { Environment } from "@possibilities/contract";

type Check = {
  label: string;
  fix: ReadonlyArray<string>;
  passes: (environment: Environment) => boolean;
};

type Step = {
  title: string;
  value?: (environment: Environment) => string | null;
  checks: ReadonlyArray<Check>;
};

export const steps: ReadonlyArray<Step> = [
  {
    title: "Git",
    checks: [
      { label: "Installed", fix: ["brew install git"], passes: (environment) => environment.git },
      {
        label: "Identity",
        fix: ["git config --global user.name …", "git config --global user.email …"],
        passes: (environment) => environment.gitIdentity,
      },
    ],
  },
  {
    title: "GitHub",
    value: (environment) => environment.githubLogin,
    checks: [
      { label: "CLI", fix: ["brew install gh"], passes: (environment) => environment.gh },
      {
        label: "Signed in",
        fix: ["gh auth login"],
        passes: (environment) => environment.githubLogin !== null,
      },
    ],
  },
];

export const isDone = (step: Step, environment: Environment) =>
  step.checks.every((check) => check.passes(environment));

export const isReady = (environment: Environment) =>
  steps.every((step) => isDone(step, environment));
