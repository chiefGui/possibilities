import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { documentsQuery } from "@/features/documents/queries";
import { useCreateDocument } from "@/features/documents/use-create-document";
import { useProject } from "@/features/projects/project-context";
import { ProjectTitle } from "@/features/projects/project-title";
import { Button } from "@possibilities/ui/button";
import { css } from "@possibilities/ui/css";
import { Icon } from "@possibilities/ui/icon";
import { row } from "@possibilities/ui/row";
import { states } from "@possibilities/ui/states";
import { text } from "@possibilities/ui/text";
import * as Shell from "@/layout/shell";

export const Route = createFileRoute("/workspaces/$workspaceId/projects/$projectId/")({
  component: ProjectPage,
});

function ProjectPage() {
  const { workspaceId, projectId } = Route.useParams();
  const project = useProject();
  const names = useSuspenseQuery(documentsQuery({ workspaceId, projectId })).data;
  const create = useCreateDocument(workspaceId, projectId);

  return (
    <>
      <Shell.Header>
        <ProjectTitle workspaceId={workspaceId} project={project} />
        <span className={styles.trailing}>
          {project.codebase && <span className={styles.codebase}>{project.codebase}</span>}
          <Button variant="ghost" disabled={create.isPending} onClick={() => create.mutate()}>
            <Icon name="add" />
            New document
          </Button>
        </span>
      </Shell.Header>
      <div className={styles.body}>
        {names.length === 0 ? (
          <p className={styles.empty}>No documents yet.</p>
        ) : (
          <nav className={styles.list}>
            {names.map((name) => (
              <Link
                key={name}
                to="/workspaces/$workspaceId/projects/$projectId/documents/$documentName"
                params={{ workspaceId, projectId, documentName: name }}
                className={css(row, states.hover, states.ring, styles.document)}
              >
                <Icon name="document" />
                <span className={css(text.truncate)}>{name}</span>
              </Link>
            ))}
          </nav>
        )}
        {create.error && <p className={styles.error}>{create.error.message}</p>}
      </div>
    </>
  );
}

const styles = {
  trailing: css({
    display: "flex",
    alignItems: "center",
    gap: "3",
    marginInlineStart: "auto",
    marginInlineEnd: "-2",
  }),
  codebase: css({
    fontWeight: "regular",
    color: "text.subtle",
  }),
  body: css({
    display: "flex",
    flexDirection: "column",
    gap: "4",
    flex: "1",
    minHeight: "0",
    overflowY: "auto",
    padding: "4",
  }),
  list: css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5",
    width: "full",
    maxWidth: "column",
    marginInline: "auto",
  }),
  document: css.raw({
    height: "md",
  }),
  empty: css({
    margin: "auto",
    color: "text.subtle",
  }),
  error: css({
    margin: "0",
    fontSize: "sm",
    color: "text.danger",
    textAlign: "center",
  }),
};
