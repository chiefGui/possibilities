import { Api } from "@possibilities/contract";
import { Effect, Layer } from "effect";

import { Documents } from "./documents.ts";
import { environment, owners, repositories } from "./github.ts";
import { Registry } from "./registry.ts";
import { ClonesDirectory, createWorkspace, openWorkspace, syncWorkspace } from "./workspaces.ts";

const handlers = Api.toLayer(
  Effect.gen(function* () {
    const registry = yield* Registry;
    const documents = yield* Documents;
    return Api.of({
      environment: () => environment,
      owners: () => owners,
      repositories: ({ owner }) => repositories(owner),
      workspaces: () => registry.list,
      openWorkspace: ({ id }) => openWorkspace(id),
      syncWorkspace: ({ id }) => syncWorkspace(id),
      createWorkspace,
      documents: documents.list,
      document: documents.read,
      createDocument: documents.create,
      saveDocument: ({ content, ...ref }) => documents.save(ref, content),
      saveDocumentView: ({ view, ...ref }) => documents.saveView(ref, view),
      renameDocument: ({ title, ...ref }) => documents.rename(ref, title),
      deleteDocument: documents.remove,
      createFolder: documents.createFolder,
      renameFolder: ({ title, ...ref }) => documents.renameFolder(ref, title),
      deleteFolder: documents.removeFolder,
      writerSettings: () => documents.settings,
      saveWriterSettings: documents.saveSettings,
    });
  }),
);

export const layer = (clonesDirectory: string) =>
  handlers.pipe(
    Layer.provide([Registry.layer, Documents.layer]),
    Layer.provide(Layer.succeed(ClonesDirectory, clonesDirectory)),
  );
