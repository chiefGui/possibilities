import {
  type CreateProject,
  type Project,
  ProjectNotFound,
  type RenameProject,
} from "@possibilities/contract";
import { Effect, FileSystem, Path, Struct } from "effect";

import { commit, git } from "./github.ts";
import { manifestFile, type ProjectEntry, readManifest, writeManifest } from "./manifest.ts";
import { gitLock, workspaceRoot } from "./workspaces.ts";

const keepFile = ".keep";

const toProject = (entry: ProjectEntry): Project => Struct.omit(entry, ["directory"]);

export const listProjects = Effect.fn("listProjects")(function* (workspaceId: string) {
  const root = yield* workspaceRoot(workspaceId);
  const { manifest } = yield* readManifest(root).pipe(Effect.orDie);
  return manifest.projects.map(toProject);
});

const directoryName = (title: string) =>
  title.replace(/[/\\:*?"<>|\p{Cc}]/gu, "-").replace(/^[\s.-]+|[\s.-]+$/g, "") || "Untitled";

const availableDirectory = Effect.fn("availableDirectory")(function* (
  root: string,
  title: string,
  current?: string,
) {
  const fs = yield* FileSystem.FileSystem;
  const entries = yield* fs.readDirectory(root).pipe(Effect.orDie);
  const taken = new Set(
    entries.filter((entry) => entry !== current).map((entry) => entry.toLowerCase()),
  );
  const base = directoryName(title);
  let candidate = base;
  for (let suffix = 2; taken.has(candidate.toLowerCase()); suffix++) {
    candidate = `${base} ${suffix}`;
  }
  return candidate;
});

const move = Effect.fn("move")(function* (root: string, from: string, to: string) {
  if (from.toLowerCase() !== to.toLowerCase()) return yield* git(root, "mv", "--", from, to);
  const through = `${to}.${crypto.randomUUID()}`;
  yield* git(root, "mv", "--", from, through);
  yield* git(root, "mv", "--", through, to);
});

type Change = { projects: ReadonlyArray<ProjectEntry>; project: ProjectEntry };

const updateProjects = Effect.fn("updateProjects")(function* <E, R>(
  workspaceId: string,
  message: string,
  change: (root: string, projects: ReadonlyArray<ProjectEntry>) => Effect.Effect<Change, E, R>,
) {
  const root = yield* workspaceRoot(workspaceId);
  return yield* Effect.gen(function* () {
    yield* git(root, "pull", "--ff-only");
    const { document, manifest } = yield* readManifest(root).pipe(Effect.orDie);
    const { projects, project } = yield* change(root, manifest.projects);
    yield* writeManifest(root, { ...document, projects });
    yield* commit(root, message, [manifestFile, project.directory]);
    return toProject(project);
  }).pipe(
    Effect.onError(() => git(root, "reset", "--hard", "@{upstream}").pipe(Effect.ignore)),
    gitLock.withPermits(1),
  );
});

export const createProject = ({ workspaceId, ...fields }: CreateProject) =>
  updateProjects(workspaceId, `Create project ${fields.title}`, (root, projects) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const directory = yield* availableDirectory(root, fields.title);
      yield* fs.makeDirectory(path.join(root, directory)).pipe(Effect.orDie);
      yield* fs.writeFileString(path.join(root, directory, keepFile), "").pipe(Effect.orDie);
      const project = { id: crypto.randomUUID(), ...fields, directory };
      return { projects: [...projects, project], project };
    }),
  );

export const renameProject = ({ workspaceId, id, title }: RenameProject) =>
  updateProjects(workspaceId, `Rename project ${title}`, (root, projects) =>
    Effect.gen(function* () {
      const index = projects.findIndex((project) => project.id === id);
      if (index === -1) {
        return yield* new ProjectNotFound({ message: `No project with id ${id}` });
      }
      const current = projects[index];
      const directory = yield* availableDirectory(root, title, current.directory);
      if (directory !== current.directory) yield* move(root, current.directory, directory);
      const project = { ...current, title, directory };
      return { projects: projects.with(index, project), project };
    }),
  );
