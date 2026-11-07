import type { EditorState, StateEffect, Text } from "@codemirror/state";
import {
  documentKey,
  type DocumentRef,
  type DocumentView,
  type FolderRef,
  isWithin,
  relocate,
} from "@possibilities/contract";

import { documentQuery, documentsQuery } from "@/features/documents/queries";
import { queryClient } from "@/query-client";
import { call } from "@/rpc";

export type SaveStatus = "saved" | "failed";

const quiet = 300;
const patience = 2000;
const retry = 3000;
const settle = 1000;
const retained = 24;

let ids = 0;

const discard = () => undefined;

export class Session {
  readonly id = ids++;
  ref: DocumentRef;
  private state: EditorState | null = null;
  private scroll: StateEffect<unknown> | null = null;
  private synced: string | null = null;
  private mounted = false;
  private pending: Text | null = null;
  private since = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private inflight: Promise<void> | null = null;
  private status: SaveStatus = "saved";
  private listeners = new Set<() => void>();
  private readView: (() => DocumentView) | null = null;
  private viewTimer: ReturnType<typeof setTimeout> | undefined;
  private removed = false;

  constructor(ref: DocumentRef) {
    this.ref = ref;
  }

  get dirty() {
    return this.pending !== null || this.inflight !== null;
  }

  get idle() {
    return !this.mounted && !this.dirty;
  }

  readonly subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  readonly saveStatus = () => this.status;

  resume(content: string) {
    this.mounted = true;
    if (!this.state || (!this.dirty && this.synced !== content)) return null;
    return { state: this.state, scroll: this.scroll };
  }

  suspend(state: EditorState, scroll: StateEffect<unknown>) {
    this.state = state;
    this.scroll = scroll;
    this.mounted = false;
  }

  adopt(content: string) {
    this.synced = content;
  }

  diverged(content: string) {
    return !this.dirty && content !== this.synced;
  }

  edit(doc: Text) {
    this.pending = doc;
    const now = performance.now();
    this.since ||= now;
    clearTimeout(this.timer);
    if (now - this.since >= patience) void this.flush();
    else this.timer = setTimeout(() => void this.flush(), quiet);
  }

  flush(): Promise<void> {
    clearTimeout(this.timer);
    if (this.inflight) return this.inflight.then(() => this.flush());
    const doc = this.pending;
    if (!doc || this.removed) return Promise.resolve();
    this.pending = null;
    this.since = 0;
    const content = doc.toString();
    const ref = this.ref;
    this.synced = content;
    const { queryKey } = documentQuery(ref);
    void queryClient.cancelQueries({ queryKey, exact: true });
    queryClient.setQueryData(queryKey, (old) => old && { ...old, content });
    const attempt = call((api) => api.saveDocument({ ...ref, content })).then(
      () => {
        this.inflight = null;
        this.setStatus("saved");
        return true;
      },
      () => {
        this.inflight = null;
        this.pending ??= doc;
        this.setStatus("failed");
        this.timer = setTimeout(() => void this.flush(), retry);
        return false;
      },
    );
    this.inflight = attempt.then(discard);
    return attempt.then((saved) => (saved && this.pending ? this.flush() : undefined));
  }

  trackView(read: () => DocumentView) {
    this.readView = read;
    clearTimeout(this.viewTimer);
    this.viewTimer = setTimeout(() => this.saveView(), settle);
  }

  saveView() {
    clearTimeout(this.viewTimer);
    const view = this.readView?.();
    this.readView = null;
    if (!view || this.removed) return;
    const ref = this.ref;
    queryClient.setQueryData(documentQuery(ref).queryKey, (old) => old && { ...old, view });
    void call((api) => api.saveDocumentView({ ...ref, view })).catch(discard);
  }

  async exclusive<T>(work: () => Promise<T>) {
    await this.flush();
    const run = work().finally(() => {
      this.inflight = null;
    });
    this.inflight = run.then(discard, discard);
    try {
      return await run;
    } finally {
      if (this.pending) void this.flush();
    }
  }

  rename(title: string) {
    return this.exclusive(async () => {
      const previous = this.ref;
      const path = await call((api) => api.renameDocument({ ...previous, title }));
      if (path !== previous.path) {
        this.retarget(path);
        updatePaths(previous.workspaceId, (paths) =>
          paths.map((other) => (other === previous.path ? path : other)),
        );
      }
      return path;
    });
  }

  async remove() {
    await this.discard();
    const ref = this.ref;
    await call((api) => api.deleteDocument(ref));
    this.forget();
    updatePaths(ref.workspaceId, (paths) => paths.filter((other) => other !== ref.path));
  }

  async discard() {
    this.removed = true;
    clearTimeout(this.timer);
    clearTimeout(this.viewTimer);
    this.pending = null;
    await this.inflight;
  }

  forget() {
    sessions.delete(documentKey(this.ref));
    queryClient.removeQueries({ queryKey: documentQuery(this.ref).queryKey, exact: true });
  }

  retarget(path: string) {
    const previous = this.ref;
    const next = { ...previous, path };
    const cached = queryClient.getQueryData(documentQuery(previous).queryKey);
    if (cached) queryClient.setQueryData(documentQuery(next).queryKey, cached);
    queryClient.removeQueries({ queryKey: documentQuery(previous).queryKey, exact: true });
    sessions.delete(documentKey(previous));
    sessions.set(documentKey(next), this);
    this.ref = next;
  }

  private setStatus(status: SaveStatus) {
    if (status === this.status) return;
    this.status = status;
    for (const listener of this.listeners) listener();
  }
}

const sessions = new Map<string, Session>();

const updatePaths = (
  workspaceId: string,
  update: (paths: ReadonlyArray<string>) => ReadonlyArray<string>,
) =>
  queryClient.setQueryData(documentsQuery(workspaceId).queryKey, (paths) => paths && update(paths));

const within = ({ workspaceId, path }: FolderRef) =>
  [...sessions.values()].filter(
    (session) => session.ref.workspaceId === workspaceId && isWithin(session.ref.path, path),
  );

const exclusively = <T>(affected: ReadonlyArray<Session>, work: () => Promise<T>) =>
  affected.reduce<() => Promise<T>>((inner, session) => () => session.exclusive(inner), work)();

export const renameFolder = (ref: FolderRef, title: string) => {
  const affected = within(ref);
  return exclusively(affected, async () => {
    const path = await call((api) => api.renameFolder({ ...ref, title }));
    if (path === ref.path) return path;
    for (const session of affected) session.retarget(relocate(session.ref.path, ref.path, path));
    updatePaths(ref.workspaceId, (paths) =>
      paths.map((other) => (isWithin(other, ref.path) ? relocate(other, ref.path, path) : other)),
    );
    return path;
  });
};

export const removeFolder = async (ref: FolderRef) => {
  const affected = within(ref);
  await Promise.all(affected.map((session) => session.discard()));
  await call((api) => api.deleteFolder(ref));
  for (const session of affected) session.forget();
  updatePaths(ref.workspaceId, (paths) => paths.filter((other) => !isWithin(other, ref.path)));
};

const evict = () => {
  for (const [key, session] of sessions) {
    if (sessions.size <= retained) return;
    if (session.idle) sessions.delete(key);
  }
};

export const sessionFor = (ref: DocumentRef) => {
  const key = documentKey(ref);
  const session = sessions.get(key) ?? new Session(ref);
  sessions.delete(key);
  sessions.set(key, session);
  evict();
  return session;
};

const flushAll = () => {
  for (const session of sessions.values()) {
    void session.flush();
    session.saveView();
  }
};

window.addEventListener("pagehide", flushAll);
window.addEventListener("blur", flushAll);
