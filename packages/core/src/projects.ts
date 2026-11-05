import {
  type CreateProject,
  type Project,
  ProjectNotFound,
  type RenameProject,
} from "@possibilities/contract";
import { Effect, FileSystem, Path, Semaphore, Struct } from "effect";

import { commit, git } from "./github.ts";
import { manifestFile, type ProjectEntry, readManifest, writeManifest } from "./manifest.ts";
import { Registry } from "./registry.ts";
import { workspaceDirectory } from "./workspaces.ts";

const projectsDirectory = ".possibilities/projects";
const keepFile = ".keep";

const projectPath = (directory: string) => `${projectsDirectory}/${directory}`;

const rootOf = Effect.fn("rootOf")(function* (workspaceId: string) {
  const registry = yield* Registry;
  const workspace = yield* registry.get(workspaceId);
  return yield* workspaceDirectory(workspace.repository);
});

const toProject = (entry: ProjectEntry): Project => Struct.omit(entry, ["directory"]);

export const listProjects = Effect.fn("listProjects")(function* (workspaceId: string) {
  const root = yield* rootOf(workspaceId);
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
  const path = yield* Path.Path;
  const entries = yield* fs
    .readDirectory(path.join(root, projectsDirectory))
    .pipe(Effect.orElseSucceed((): ReadonlyArray<string> => []));
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
  const [source, target] = [projectPath(from), projectPath(to)];
  if (from.toLowerCase() !== to.toLowerCase()) return yield* git(root, "mv", "--", source, target);
  const through = `${target}.${crypto.randomUUID()}`;
  yield* git(root, "mv", "--", source, through);
  yield* git(root, "mv", "--", through, target);
});

const writes = Semaphore.makeUnsafe(1);

type Change = { projects: ReadonlyArray<ProjectEntry>; project: ProjectEntry };

const updateProjects = Effect.fn("updateProjects")(function* <E, R>(
  workspaceId: string,
  message: string,
  change: (root: string, projects: ReadonlyArray<ProjectEntry>) => Effect.Effect<Change, E, R>,
) {
  const root = yield* rootOf(workspaceId);
  return yield* Effect.gen(function* () {
    yield* git(root, "pull", "--ff-only");
    const { document, manifest } = yield* readManifest(root).pipe(Effect.orDie);
    const { projects, project } = yield* change(root, manifest.projects);
    yield* writeManifest(root, { ...document, projects });
    yield* commit(root, message, [manifestFile, projectPath(project.directory)]);
    return toProject(project);
  }).pipe(
    Effect.onError(() => git(root, "reset", "--hard", "@{upstream}").pipe(Effect.ignore)),
    writes.withPermits(1),
  );
});

export const createProject = ({ workspaceId, ...fields }: CreateProject) =>
  updateProjects(workspaceId, `Create project ${fields.title}`, (root, projects) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const directory = yield* availableDirectory(root, fields.title);
      const folder = path.join(root, projectPath(directory));
      yield* fs.makeDirectory(folder, { recursive: true }).pipe(Effect.orDie);
      yield* fs.writeFileString(path.join(folder, keepFile), "").pipe(Effect.orDie);
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
