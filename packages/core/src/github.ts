import { Environment, Repository } from "@possibilities/contract";
import { Effect, Option, Schema } from "effect";

import { run, succeeds } from "./command.ts";

const viaGh = ["-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential"];

export const git = (cwd: string, ...args: ReadonlyArray<string>) =>
  run("git", [...viaGh, ...args], cwd);

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

export const repositories = run("gh", [
  "repo",
  "list",
  "--limit",
  "200",
  "--json",
  "nameWithOwner,isPrivate",
]).pipe(Effect.flatMap((json) => Effect.orDie(decodeRepositories(json))));

export const createRepository = (name: string) => run("gh", ["repo", "create", name, "--private"]);

export const clone = (nameWithOwner: string, path: string) =>
  run("gh", ["repo", "clone", nameWithOwner, path]);
