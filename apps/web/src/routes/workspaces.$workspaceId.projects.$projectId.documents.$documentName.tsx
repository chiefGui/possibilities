import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DocumentMenu } from "@/features/documents/document-menu";
import { DocumentStatus } from "@/features/documents/document-status";
import { DocumentTitle } from "@/features/documents/document-title";
import { Editor } from "@/features/documents/editor/editor";
import { writerFont } from "@/features/documents/editor/font";
import type { Stats } from "@/features/documents/editor/words";
import { documentQuery, writerSettingsQuery } from "@/features/documents/queries";
import { sessionFor } from "@/features/documents/session";
import { useWriterSettings } from "@/features/documents/writer-settings";
import { useProject } from "@/features/projects/project-context";
import { css } from "@possibilities/ui/css";
import { states } from "@possibilities/ui/states";
import { text } from "@possibilities/ui/text";
import * as Shell from "@/layout/shell";

export const Route = createFileRoute(
  "/workspaces/$workspaceId/projects/$projectId/documents/$documentName",
)({
  loader: ({ context, params: { workspaceId, projectId, documentName } }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        documentQuery({ workspaceId, projectId, name: documentName }),
      ),
      context.queryClient.ensureQueryData(writerSettingsQuery),
      writerFont(),
    ]),
  component: DocumentPage,
});

function DocumentPage() {
  const { workspaceId, projectId, documentName } = Route.useParams();
  const project = useProject();
  const session = useMemo(
    () => sessionFor({ workspaceId, projectId, name: documentName }),
    [workspaceId, projectId, documentName],
  );
  const document = useSuspenseQuery(documentQuery(session.ref)).data;
  const { settings, toggle } = useWriterSettings();
  const [stats, setStats] = useState<Stats | null>(null);

  return (
    <>
      <Shell.Header>
        <Link
          to="/workspaces/$workspaceId/projects/$projectId"
          params={{ workspaceId, projectId }}
          className={css(text.truncate, states.ring, styles.project)}
        >
          {project.title}
        </Link>
        <span aria-hidden className={styles.separator}>
          /
        </span>
        <DocumentTitle session={session} name={documentName} />
        <span className={styles.trailing}>
          <DocumentStatus session={session} stats={stats} />
          <DocumentMenu session={session} settings={settings} onToggle={toggle} />
        </span>
      </Shell.Header>
      <Editor
        key={session.id}
        session={session}
        document={document}
        settings={settings}
        onStats={setStats}
        onToggle={toggle}
      />
    </>
  );
}

const styles = {
  project: css.raw({
    flexShrink: "1",
    borderRadius: "xs",
    color: { base: "text.subtle", _hover: "text.default" },
    textDecoration: "none",
  }),
  separator: css({
    color: "text.faint",
    fontWeight: "regular",
  }),
  trailing: css({
    display: "flex",
    alignItems: "center",
    gap: "3",
    marginInlineStart: "auto",
    marginInlineEnd: "-2",
  }),
};
