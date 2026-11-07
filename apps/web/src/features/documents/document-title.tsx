import { nameOf } from "@possibilities/contract";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { documentParams, documentRoute } from "@/features/documents/links";
import type { Session } from "@/features/documents/session";
import { css } from "@possibilities/ui/css";
import { EditableText } from "@possibilities/ui/editable-text";
import { text } from "@possibilities/ui/text";

export function DocumentTitle({ session }: { session: Session }) {
  const navigate = useNavigate();
  const name = nameOf(session.ref.path);

  const rename = useMutation({
    mutationFn: (title: string) => session.rename(title),
    onSuccess: (path) =>
      navigate({
        to: documentRoute,
        params: documentParams(session.ref.workspaceId, path),
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
