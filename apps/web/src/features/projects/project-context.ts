import type { Project } from "@possibilities/contract";
import { createContext, use } from "react";

export const ProjectContext = createContext<Project | null>(null);

export function useProject() {
  const project = use(ProjectContext);
  if (!project) throw new Error("useProject must be used inside a project route");
  return project;
}
