import { byDocumentName, isWithin, nameOf, parentOf, root } from "@possibilities/contract";

export type Folder = {
  path: string;
  folders: Array<Folder>;
  documents: Array<string>;
};

export type Entry = { kind: "document" | "folder"; path: string };

export const covers = (entry: Entry, path: string) =>
  path === entry.path || (entry.kind === "folder" && isWithin(path, entry.path));

export const buildTree = (paths: ReadonlyArray<string>) => {
  const top: Folder = { path: root, folders: [], documents: [] };
  const folders = new Map([[root, top]]);
  const folderAt = (path: string): Folder => {
    const found = folders.get(path);
    if (found) return found;
    const folder: Folder = { path, folders: [], documents: [] };
    folderAt(parentOf(path)).folders.push(folder);
    folders.set(path, folder);
    return folder;
  };
  for (const path of paths) folderAt(parentOf(path)).documents.push(path);
  for (const folder of folders.values()) {
    folder.folders.sort((a, b) => byDocumentName(nameOf(a.path), nameOf(b.path)));
    folder.documents.sort((a, b) => byDocumentName(nameOf(a), nameOf(b)));
  }
  return top;
};

export const empty = buildTree([]);

export const ancestors = (path: string) => {
  const found: Array<string> = [];
  for (let folder = parentOf(path); folder !== root; folder = parentOf(folder)) found.push(folder);
  return found;
};
