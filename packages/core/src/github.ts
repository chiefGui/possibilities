import { Environment, Repository } from "@possibilities/contract";
import { Effect, Option, Schema } from "effect";

import { run, succeeds } from "./command.ts";

const ghCredentials = [
  "-c",
  "credential.helper=",
  "-c",
  "credential.helper=!gh auth git-credential",
];

export const git = (cwd: string, ...args: ReadonlyArray<string>) =>
  run("git", [...ghCredentials, ...args], cwd);

export const commit = Effect.fn("commit")(function* (
  cwd: string,
  message: string,
  paths: ReadonlyArray<string>,
) {
  yield* git(cwd, "add", "--", ...paths);
  if (yield* git(cwd, "diff", "--cached", "--name-only")) {
    yield* git(cwd, "commit", "-m", message);
    yield* git(cwd, "push", "-u", "origin", "HEAD");
  }
});

export const login = run("gh", ["api", "user", "--jq", ".login"]);

export const environment = Effect.gen(function* () {
  const [installed, name, email, gh, githubLogin] = yield* Effect.all(
    [
      succeeds(run("git", ["--version"])),
      run("git", ["config", "user.name"]).pipe(Effect.option),
      run("git", ["config", "user.email"]).pipe(Effect.option),
      succeeds(run("gh", ["--version"])),
      login.pipe(Effect.option),
    ],
    { concurrency: "unbounded" },
  );
  return Environment.make({
    git: installed,
    gitIdentity: Option.isSome(name) && Option.isSome(email),
    gh,
    githubLogin: Option.getOrNull(githubLogin),
  });
});

const decodeRepositories = Schema.decodeUnknownEffect(
  Schema.fromJsonString(Schema.Array(Repository)),
);

export const owners = Effect.all(
  [login, run("gh", ["api", "user/orgs", "--paginate", "--jq", ".[].login"])],
  { concurrency: "unbounded" },
).pipe(
  Effect.map(([user, orgs]) => [
    user,
    ...orgs
      .split("\n")
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b)),
  ]),
);

export const repositories = (owner: string) =>
  run("gh", ["repo", "list", owner, "--limit", "1000", "--json", "nameWithOwner,isPrivate"]).pipe(
    Effect.flatMap((json) => Effect.orDie(decodeRepositories(json))),
  );

export const createRepository = (nameWithOwner: string) =>
  run("gh", ["repo", "create", nameWithOwner, "--private"]);

export const clone = (nameWithOwner: string, path: string) =>
  run("gh", ["repo", "clone", nameWithOwner, path]);
