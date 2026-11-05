import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";

import { projectsQuery } from "@/features/projects/queries";
import { RepositoryPicker } from "@/features/repositories/repository-picker";
import { call } from "@/rpc";
import { Actions } from "@/ui/actions";
import { Button } from "@/ui/button";
import * as Field from "@/ui/field";
import * as Form from "@/ui/form";
import * as Input from "@/ui/input";

export function ProjectForm({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children?: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [codebase, setCodebase] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: () =>
      call((api) =>
        api.createProject({ workspaceId, title: title.trim(), ...(codebase ? { codebase } : {}) }),
      ),
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({ queryKey: projectsQuery(workspaceId).queryKey });
      await navigate({
        to: "/workspaces/$workspaceId/projects/$projectId",
        params: { workspaceId, projectId: project.id },
      });
    },
  });

  return (
    <Form.Root
      onFormSubmit={() => {
        if (title.trim()) create.mutate();
      }}
    >
      <Field.Root name="title">
        <Field.Label>Title</Field.Label>
        <Input.Root>
          <Input.Control autoFocus value={title} placeholder="Website" onValueChange={setTitle} />
        </Input.Root>
      </Field.Root>

      <Field.Root name="codebase">
        <Field.Label>Codebase</Field.Label>
        <RepositoryPicker value={codebase} onValueChange={setCodebase} noneLabel="No codebase" />
      </Field.Root>

      {create.error && <Form.Error>{create.error.message}</Form.Error>}

      <Actions>
        {children}
        <Button type="submit" disabled={!title.trim() || create.isPending}>
          {create.isPending ? "Creating…" : "Create project"}
        </Button>
      </Actions>
    </Form.Root>
  );
}
