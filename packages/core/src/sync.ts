import { Effect } from "effect";

import { git } from "./github.ts";
import { documentExtension, projectsDirectory } from "./manifest.ts";

const documentsPathspec = `:(glob)${projectsDirectory}/*/*${documentExtension}`;

const changedDocuments = (root: string) =>
  git(root, "status", "--porcelain", "-z", "--untracked-files=all", "--", documentsPathspec).pipe(
    Effect.map((output) => {
      const paths: Array<string> = [];
      const entries = output.split("\0");
      for (let index = 0; index < entries.length; index++) {
        const entry = entries[index] ?? "";
        if (entry.length < 4) continue;
        paths.push(entry.slice(3));
        if (entry[0] === "R" || entry[0] === "C") index++;
      }
      return paths;
    }),
  );

const subject = (paths: ReadonlyArray<string>) => {
  const names = [
    ...new Set(
      paths.map((file) => file.slice(file.lastIndexOf("/") + 1, -documentExtension.length)),
    ),
  ];
  const shown = names.slice(0, 3).join(", ");
  return names.length > 3 ? `Update ${shown} and ${names.length - 3} more` : `Update ${shown}`;
};

export const commitDocuments = Effect.fn("commitDocuments")(function* (root: string) {
  const paths = yield* changedDocuments(root);
  if (paths.length === 0) return;
  yield* git(root, "add", "-A", "--", documentsPathspec);
  yield* git(root, "commit", "-m", subject(paths));
});

export const head = (root: string) => git(root, "rev-parse", "HEAD");

export const integrate = Effect.fn("integrate")(function* (root: string) {
  yield* git(root, "fetch", "--quiet");
  yield* git(root, "rebase", "--autostash", "@{upstream}").pipe(
    Effect.catch(() =>
      git(root, "rebase", "--abort").pipe(
        Effect.ignore,
        Effect.andThen(git(root, "merge", "--no-edit", "-X", "ours", "@{upstream}")),
        Effect.tapError(() => git(root, "merge", "--abort").pipe(Effect.ignore)),
      ),
    ),
  );
});

const publish = Effect.fn("publish")(function* (root: string) {
  const ahead = yield* git(root, "rev-list", "--count", "@{upstream}..HEAD").pipe(
    Effect.map((count) => count !== "0"),
    Effect.orElseSucceed(() => true),
  );
  if (ahead) yield* git(root, "push", "-u", "origin", "HEAD");
});

export const sync = Effect.fn("sync")(function* (root: string) {
  yield* commitDocuments(root);
  const before = yield* head(root);
  yield* integrate(root);
  const changed = (yield* head(root)) !== before;
  yield* publish(root);
  return changed;
});
