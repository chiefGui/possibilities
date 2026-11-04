import {
  type CreateProject,
  Project,
  ProjectNotFound,
  type RenameProject,
} from "@possibilities/contract";
import { Effect, Semaphore } from "effect";

import { git } from "./github.ts";
import { readManifest, writeManifest } from "./manifest.ts";
import { Registry } from "./registry.ts";
import { workspaceDirectory } from "./workspaces.ts";

const directoryOf = Effect.fn("directoryOf")(function* (workspaceId: string) {
  const registry = yield* Registry;
  const workspace = yield* registry.get(workspaceId);
  return yield* workspaceDirectory(workspace.repository);
});

export const listProjects = Effect.fn("listProjects")(function* (workspaceId: string) {
  const directory = yield* directoryOf(workspaceId);
  const { manifest } = yield* readManifest(directory).pipe(Effect.orDie);
  return manifest.projects;
});

const writes = Semaphore.makeUnsafe(1);

type Change = { projects: ReadonlyArray<Project>; project: Project };

const updateProjects = Effect.fn("updateProjects")(function* <E>(
  workspaceId: string,
  message: string,
  change: (projects: ReadonlyArray<Project>) => Effect.Effect<Change, E>,
) {
  const directory = yield* directoryOf(workspaceId);
  return yield* Effect.gen(function* () {
    yield* git(directory, "pull", "--ff-only");
    const { document, manifest } = yield* readManifest(directory).pipe(Effect.orDie);
    const { projects, project } = yield* change(manifest.projects);
    yield* writeManifest(directory, { ...document, projects }, message);
    return project;
  }).pipe(
    Effect.onError(() => git(directory, "reset", "--hard", "@{upstream}").pipe(Effect.ignore)),
    writes.withPermits(1),
  );
});

export const createProject = ({ workspaceId, ...fields }: CreateProject) => {
  const project = Project.make({ id: crypto.randomUUID(), ...fields });
  return updateProjects(workspaceId, `Create project ${project.title}`, (projects) =>
    Effect.succeed({ projects: [...projects, project], project }),
  );
};

export const renameProject = ({ workspaceId, id, title }: RenameProject) =>
  updateProjects(workspaceId, `Rename project ${title}`, (projects) => {
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) {
      return Effect.fail(new ProjectNotFound({ message: `No project with id ${id}` }));
    }
    const project = { ...projects[index], title };
    return Effect.succeed({ projects: projects.with(index, project), project });
  });
