import type { Environment } from "@possibilities/contract";

type Check = { label: string; ok: boolean; fix: ReadonlyArray<string> };
type Step = { title: string; value?: string; checks: ReadonlyArray<Check> };

export const stepsOf = (environment: Environment): ReadonlyArray<Step> => [
  {
    title: "Git",
    checks: [
      { label: "Installed", ok: environment.git, fix: ["brew install git"] },
      {
        label: "Identity",
        ok: environment.gitIdentity,
        fix: ["git config --global user.name …", "git config --global user.email …"],
      },
    ],
  },
  {
    title: "GitHub",
    value: environment.githubLogin ?? undefined,
    checks: [
      { label: "CLI", ok: environment.gh, fix: ["brew install gh"] },
      {
        label: "Signed in",
        ok: environment.githubLogin !== null,
        fix: ["gh auth login"],
      },
    ],
  },
];

export const isDone = (step: Step) => step.checks.every((check) => check.ok);

export const isReady = (environment: Environment) => stepsOf(environment).every(isDone);
