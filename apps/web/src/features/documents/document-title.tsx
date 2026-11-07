import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import type { Session } from "@/features/documents/session";
import { css } from "@possibilities/ui/css";
import { EditableText } from "@possibilities/ui/editable-text";
import { text } from "@possibilities/ui/text";

export function DocumentTitle({ session, name }: { session: Session; name: string }) {
  const navigate = useNavigate();

  const rename = useMutation({
    mutationFn: (title: string) => session.rename(title),
    onSuccess: (renamed) =>
      navigate({
        to: "/workspaces/$workspaceId/projects/$projectId/documents/$documentName",
        params: {
          workspaceId: session.ref.workspaceId,
          projectId: session.ref.projectId,
          documentName: renamed,
        },
        replace: true,
      }),
  });

  return (
    <>
      <EditableText
        key={name}
        aria-label="Document title"
        defaultValue={name}
        onCommit={(title) => rename.mutate(title)}
      />
      {rename.error && (
        <span role="alert" className={css(text.truncate, error)}>
          {rename.error.message}
        </span>
      )}
    </>
  );
}

const error = css.raw({
  fontSize: "sm",
  fontWeight: "regular",
  color: "text.danger",
});
