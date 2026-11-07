import { useSuspenseQuery } from "@tanstack/react-query";
import { segments } from "@possibilities/contract";
import { createFileRoute } from "@tanstack/react-router";
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
import { css } from "@possibilities/ui/css";
import { text } from "@possibilities/ui/text";
import * as Shell from "@/layout/shell";

export const Route = createFileRoute("/workspaces/$workspaceId/documents/$")({
  loader: ({ context, params: { workspaceId, _splat: path = "" } }) =>
    Promise.all([
      context.queryClient.ensureQueryData(documentQuery({ workspaceId, path })),
      context.queryClient.ensureQueryData(writerSettingsQuery),
      writerFont(),
    ]),
  component: DocumentPage,
});

function DocumentPage() {
  const { workspaceId, _splat: path = "" } = Route.useParams();
  const session = useMemo(() => sessionFor({ workspaceId, path }), [workspaceId, path]);
  const document = useSuspenseQuery(documentQuery(session.ref)).data;
  const { settings, toggle } = useWriterSettings();
  const [stats, setStats] = useState<Stats | null>(null);

  return (
    <>
      <Shell.Header>
        {segments(path)
          .slice(0, -1)
          .map((folder, index) => (
            <span key={index} className={styles.crumb}>
              <span className={css(text.truncate)}>{folder}</span>
              <span aria-hidden className={styles.separator}>
                /
              </span>
            </span>
          ))}
        <DocumentTitle session={session} />
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
  crumb: css({
    display: "flex",
    gap: "3",
    minWidth: "0",
    flexShrink: "1",
    color: "text.subtle",
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
