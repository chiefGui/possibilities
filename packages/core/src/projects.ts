import {
  type CreateProject,
  type Project,
  ProjectNotFound,
  type RenameProject,
} from "@possibilities/contract";
import { Effect, FileSystem, Path, Struct } from "effect";

import { commit, git } from "./github.ts";
import {
  manifestFile,
  type ProjectEntry,
  projectsDirectory,
  readManifest,
  writeManifest,
} from "./manifest.ts";
import { availableName } from "./names.ts";
import { commitDocuments, head, integrate } from "./sync.ts";
import { gitLock, workspaceRoot } from "./workspaces.ts";

const keepFile = ".keep";

const projectPath = (directory: string) => `${projectsDirectory}/${directory}`;

const missingProject = (id: string) => new ProjectNotFound({ message: `No project with id ${id}` });

export const projectFolder = Effect.fn("projectFolder")(function* (root: string, id: string) {
  const path = yield* Path.Path;
  const { manifest } = yield* readManifest(root).pipe(Effect.orDie);
  const project = manifest.projects.find((candidate) => candidate.id === id);
  if (!project) return yield* missingProject(id);
  return path.join(root, projectPath(project.directory));
});

const toProject = (entry: ProjectEntry): Project => Struct.omit(entry, ["directory"]);

export const listProjects = Effect.fn("listProjects")(function* (workspaceId: string) {
  const root = yield* workspaceRoot(workspaceId);
  const { manifest } = yield* readManifest(root).pipe(Effect.orDie);
  return manifest.projects.map(toProject);
});

const availableDirectory = Effect.fn("availableDirectory")(function* (
  root: string,
  title: string,
  current?: string,
) {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const entries = yield* fs
    .readDirectory(path.join(root, projectsDirectory))
    .pipe(Effect.orElseSucceed(() => []));
  return availableName(entries, title, current);
});

const move = Effect.fn("move")(function* (root: string, from: string, to: string) {
  const [source, target] = [projectPath(from), projectPath(to)];
  if (from.toLowerCase() !== to.toLowerCase()) return yield* git(root, "mv", "--", source, target);
  const through = `${target}.${crypto.randomUUID()}`;
  yield* git(root, "mv", "--", source, through);
  yield* git(root, "mv", "--", through, target);
});

type Change = { projects: ReadonlyArray<ProjectEntry>; project: ProjectEntry };

const updateProjects = Effect.fn("updateProjects")(function* <E, R>(
  workspaceId: string,
  message: string,
  change: (root: string, projects: ReadonlyArray<ProjectEntry>) => Effect.Effect<Change, E, R>,
) {
  const root = yield* workspaceRoot(workspaceId);
  return yield* Effect.gen(function* () {
    yield* commitDocuments(root);
    yield* integrate(root);
    const before = yield* head(root);
    return yield* Effect.gen(function* () {
      const { document, manifest } = yield* readManifest(root).pipe(Effect.orDie);
      const { projects, project } = yield* change(root, manifest.projects);
      yield* writeManifest(root, { ...document, projects });
      yield* commit(root, message, [manifestFile, projectPath(project.directory)]);
      return toProject(project);
    }).pipe(Effect.onError(() => git(root, "reset", "--hard", before).pipe(Effect.ignore)));
  }).pipe(gitLock.withPermits(1));
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
      const current = projects.find((project) => project.id === id);
      if (!current) return yield* missingProject(id);
      const directory = yield* availableDirectory(root, title, current.directory);
      if (directory !== current.directory) yield* move(root, current.directory, directory);
      const project = { ...current, title, directory };
      return { projects: projects.map((other) => (other === current ? project : other)), project };
    }),
  );
