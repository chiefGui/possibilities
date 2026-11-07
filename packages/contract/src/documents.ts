import { Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";

import { ProjectNotFound } from "./projects.ts";
import { WorkspaceNotFound } from "./workspaces.ts";

export const ProjectRef = Schema.Struct({ workspaceId: Schema.String, projectId: Schema.String });
export type ProjectRef = typeof ProjectRef.Type;

export const DocumentRef = Schema.Struct({ ...ProjectRef.fields, name: Schema.String });
export type DocumentRef = typeof DocumentRef.Type;

export const DocumentView = Schema.Struct({
  anchor: Schema.Number,
  head: Schema.Number,
  top: Schema.Number,
});
export type DocumentView = typeof DocumentView.Type;

export const Document = Schema.Struct({
  content: Schema.String,
  view: Schema.NullOr(DocumentView),
});
export type Document = typeof Document.Type;

export const WriterSettings = Schema.Struct({
  focus: Schema.Boolean,
  typewriter: Schema.Boolean,
});
export type WriterSettings = typeof WriterSettings.Type;

export const byDocumentName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

export class DocumentNotFound extends Schema.TaggedError<DocumentNotFound>()("DocumentNotFound", {
  message: Schema.String,
}) {}

const Missing = Schema.Union([WorkspaceNotFound, ProjectNotFound]);

export const DocumentsApi = RpcGroup.make(
  Rpc.make("documents", {
    payload: ProjectRef,
    success: Schema.Array(Schema.String),
    error: Missing,
  }),
  Rpc.make("document", {
    payload: DocumentRef,
    success: Document,
    error: Schema.Union([WorkspaceNotFound, ProjectNotFound, DocumentNotFound]),
  }),
  Rpc.make("createDocument", {
    payload: ProjectRef,
    success: Schema.String,
    error: Missing,
  }),
  Rpc.make("saveDocument", {
    payload: { ...DocumentRef.fields, content: Schema.String },
    error: Missing,
  }),
  Rpc.make("saveDocumentView", {
    payload: { ...DocumentRef.fields, view: DocumentView },
  }),
  Rpc.make("renameDocument", {
    payload: { ...DocumentRef.fields, title: Schema.String },
    success: Schema.String,
    error: Missing,
  }),
  Rpc.make("deleteDocument", {
    payload: DocumentRef,
    error: Missing,
  }),
  Rpc.make("writerSettings", { success: WriterSettings }),
  Rpc.make("saveWriterSettings", { payload: WriterSettings }),
);
