import { Schema } from "effect";
import { Rpc, RpcGroup } from "effect/rpc";

import { WorkspaceNotFound } from "./workspaces.ts";

export const WorkspaceRef = Schema.Struct({ workspaceId: Schema.String });
export type WorkspaceRef = typeof WorkspaceRef.Type;

export const DocumentRef = Schema.Struct({ ...WorkspaceRef.fields, path: Schema.String });
export type DocumentRef = typeof DocumentRef.Type;

export const FolderRef = DocumentRef;
export type FolderRef = DocumentRef;

export const root = "";

const separator = "/";

export const segments = (path: string) => (path === root ? [] : path.split(separator));

export const nameOf = (path: string) => path.slice(path.lastIndexOf(separator) + 1);

export const parentOf = (path: string) => path.slice(0, Math.max(0, path.lastIndexOf(separator)));

export const childOf = (folder: string, name: string) =>
  folder === root ? name : `${folder}${separator}${name}`;

export const isWithin = (path: string, folder: string) =>
  folder === root || path.startsWith(`${folder}${separator}`);

export const relocate = (path: string, from: string, to: string) =>
  `${to}${path.slice(from.length)}`;

export const documentKey = ({ workspaceId, path }: DocumentRef) =>
  JSON.stringify([workspaceId, path]);

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

const Missing = Schema.Union([WorkspaceNotFound, DocumentNotFound]);

export const DocumentsApi = RpcGroup.make(
  Rpc.make("documents", {
    payload: WorkspaceRef,
    success: Schema.Array(Schema.String),
    error: WorkspaceNotFound,
  }),
  Rpc.make("document", {
    payload: DocumentRef,
    success: Document,
    error: Missing,
  }),
  Rpc.make("createDocument", {
    payload: FolderRef,
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
  Rpc.make("createFolder", {
    payload: FolderRef,
    success: Schema.String,
    error: Missing,
  }),
  Rpc.make("renameFolder", {
    payload: { ...FolderRef.fields, title: Schema.String },
    success: Schema.String,
    error: Missing,
  }),
  Rpc.make("deleteFolder", {
    payload: FolderRef,
    error: Missing,
  }),
  Rpc.make("writerSettings", { success: WriterSettings }),
  Rpc.make("saveWriterSettings", { payload: WriterSettings }),
);
