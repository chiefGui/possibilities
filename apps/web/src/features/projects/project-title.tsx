import type { Project } from "@possibilities/contract";
import * as stylex from "@stylexjs/stylex";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { projectsQuery } from "@/features/projects/queries";
import { call } from "@/rpc";
import { text as color } from "@possibilities/ui/theme/colors.stylex";
import { fontSize, weight } from "@possibilities/ui/theme/tokens.stylex";
import { EditableText } from "@possibilities/ui/editable-text";
import { text } from "@possibilities/ui/text";

export function ProjectTitle({ workspaceId, project }: { workspaceId: string; project: Project }) {
  const queryClient = useQueryClient();
  const { queryKey } = projectsQuery(workspaceId);

  const rename = useMutation({
    mutationFn: (title: string) =>
      call((api) => api.renameProject({ workspaceId, id: project.id, title })),
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (projects) =>
        projects?.map((candidate) =>
          candidate.id === project.id ? { ...candidate, title } : candidate,
        ),
      );
      return { previous };
    },
    onError: (_error, _title, context) => queryClient.setQueryData(queryKey, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return (
    <>
      <EditableText
        key={project.title}
        aria-label="Project title"
        defaultValue={project.title}
        onCommit={(title) => rename.mutate(title)}
      />
      {rename.error && (
        <span role="alert" {...stylex.props(text.truncate, styles.error)}>
          {rename.error.message}
        </span>
      )}
    </>
  );
}

const styles = stylex.create({
  error: {
    fontSize: fontSize.sm,
    fontWeight: weight.regular,
    color: color.danger,
  },
});
