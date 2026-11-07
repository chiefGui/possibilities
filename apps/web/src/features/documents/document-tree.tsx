import { nameOf, relocate, root } from "@possibilities/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Fragment, type ReactElement, type ReactNode, useState } from "react";

import { DeleteDialog } from "@/features/documents/delete-dialog";
import { documentParams, documentRoute } from "@/features/documents/links";
import { documentsQuery } from "@/features/documents/queries";
import { renameFolder, sessionFor } from "@/features/documents/session";
import {
  ancestors,
  buildTree,
  covers,
  empty,
  type Entry,
  type Folder,
} from "@/features/documents/tree";
import { useCreate } from "@/features/documents/use-create";
import * as ContextMenu from "@possibilities/ui/context-menu";
import { css } from "@possibilities/ui/css";
import { EditableText } from "@possibilities/ui/editable-text";
import { Icon } from "@possibilities/ui/icon";
import * as Menu from "@possibilities/ui/menu";
import * as Sidebar from "@/layout/sidebar";

const reveal = (expanded: ReadonlySet<string>, path: string | undefined) =>
  path ? new Set([...expanded, ...ancestors(path)]) : expanded;

export function DocumentTree({ workspaceId }: { workspaceId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tree = useQuery({ ...documentsQuery(workspaceId), select: buildTree }).data ?? empty;
  const { _splat: active } = useParams({ strict: false });
  const [expanded, setExpanded] = useState(() => reveal(new Set(), active));
  const [revealed, setRevealed] = useState(active);
  const [renaming, setRenaming] = useState<Entry | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [confirming, setConfirming] = useState(false);
  const createDocument = useCreate(workspaceId, "createDocument");
  const createFolder = useCreate(workspaceId, "createFolder");

  if (active !== revealed) {
    setRevealed(active);
    setExpanded((current) => reveal(current, active));
  }

  const rename = useMutation({
    mutationFn: ({ entry, title }: { entry: Entry; title: string }) =>
      entry.kind === "document"
        ? sessionFor({ workspaceId, path: entry.path }).rename(title)
        : renameFolder({ workspaceId, path: entry.path }, title),
    onSuccess: async (path, { entry }) => {
      const follow = (other: string) =>
        covers(entry, other) ? relocate(other, entry.path, path) : other;
      setExpanded((current) => new Set([...current].map(follow)));
      if (active && covers(entry, active)) {
        await navigate({
          to: documentRoute,
          params: documentParams(workspaceId, follow(active)),
          replace: true,
        });
      }
    },
    onError: () =>
      queryClient.invalidateQueries({ queryKey: documentsQuery(workspaceId).queryKey }),
  });

  const toggle = (folder: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(folder)) next.add(folder);
      return next;
    });

  const row = (entry: Entry, icon: ReactNode, trigger: ReactElement, items?: ReactNode) =>
    renaming?.kind === entry.kind && renaming.path === entry.path ? (
      <Sidebar.Row onBlur={() => setRenaming(null)}>
        {icon}
        <EditableText
          autoFocus
          aria-label={`Rename ${nameOf(entry.path)}`}
          defaultValue={nameOf(entry.path)}
          onFocus={(event) => event.currentTarget.select()}
          onCommit={(title) => rename.mutate({ entry, title })}
        />
      </Sidebar.Row>
    ) : (
      <ContextMenu.Root>
        <ContextMenu.Trigger render={trigger}>
          {icon}
          <Sidebar.Label>{nameOf(entry.path)}</Sidebar.Label>
        </ContextMenu.Trigger>
        <ContextMenu.Popup>
          {items}
          <Menu.Item onClick={() => setRenaming(entry)}>
            <Icon name="rename" />
            Rename
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setDeleting(entry);
              setConfirming(true);
            }}
          >
            <Icon name="delete" />
            Delete
          </Menu.Item>
        </ContextMenu.Popup>
      </ContextMenu.Root>
    );

  const documentRow = (path: string) => (
    <Fragment key={path}>
      {row(
        { kind: "document", path },
        <Icon name="document" />,
        <Sidebar.Item to={documentRoute} params={documentParams(workspaceId, path)} />,
      )}
    </Fragment>
  );

  const folderRow = (folder: Folder) => {
    const { path } = folder;
    const open = expanded.has(path);
    return (
      <Fragment key={path}>
        {row(
          { kind: "folder", path },
          <Icon name={open ? "openFolder" : "folder"} />,
          <Sidebar.Button aria-expanded={open} onClick={() => toggle(path)} />,
          <>
            <Menu.Item onClick={() => createDocument.mutate(path)}>
              <Icon name="newDocument" />
              New document
            </Menu.Item>
            <Menu.Item onClick={() => createFolder.mutate(path)}>
              <Icon name="newFolder" />
              New folder
            </Menu.Item>
            <Menu.Separator />
          </>,
        )}
        {open && <Sidebar.Nested>{branch(folder)}</Sidebar.Nested>}
      </Fragment>
    );
  };

  const branch = (folder: Folder) => (
    <>
      {folder.folders.map(folderRow)}
      {folder.documents.map(documentRow)}
    </>
  );

  const failure = rename.error ?? createDocument.error ?? createFolder.error;

  return (
    <Sidebar.Section>
      <Sidebar.SectionHeader>
        Documents
        <Sidebar.Actions>
          <Sidebar.Action
            aria-label="New document"
            disabled={createDocument.isPending}
            onClick={() => createDocument.mutate(root)}
          >
            <Icon name="newDocument" />
          </Sidebar.Action>
          <Sidebar.Action
            aria-label="New folder"
            disabled={createFolder.isPending}
            onClick={() => createFolder.mutate(root)}
          >
            <Icon name="newFolder" />
          </Sidebar.Action>
        </Sidebar.Actions>
      </Sidebar.SectionHeader>
      {tree.folders.length + tree.documents.length === 0 ? (
        <p className={css(styles.note)}>No documents yet.</p>
      ) : (
        branch(tree)
      )}
      {failure && (
        <p role="alert" className={css(styles.note, styles.failure)}>
          {failure.message}
        </p>
      )}
      {deleting && (
        <DeleteDialog
          workspaceId={workspaceId}
          entry={deleting}
          open={confirming}
          onOpenChange={setConfirming}
        />
      )}
    </Sidebar.Section>
  );
}

const styles = {
  note: css.raw({
    margin: "0",
    paddingInline: "2",
    fontSize: "sm",
    color: "text.subtle",
  }),
  failure: css.raw({
    color: "text.danger",
  }),
};
