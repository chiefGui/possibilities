import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type RepositoryChoice, WorkspaceExists } from "@possibilities/contract";
import { type ReactNode, useState } from "react";

import { environmentQuery } from "@/features/environment/queries";
import { workspacesQuery } from "@/features/workspaces/queries";
import { RepositoryPicker } from "@/features/repositories/repository-picker";
import { call } from "@/rpc";
import { Actions } from "@/ui/actions";
import { Button } from "@/ui/button";
import * as Field from "@/ui/field";
import * as Form from "@/ui/form";
import * as Input from "@/ui/input";
import * as Tabs from "@/ui/tabs";

type Source = "New" | "Existing";

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function WorkspaceForm({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [source, setSource] = useState<Source>("New");
  const [name, setName] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const login = useQuery(environmentQuery).data?.githubLogin;
  const repositoryName = name ?? slugify(title);

  const create = useMutation({
    mutationFn: (repository: RepositoryChoice) =>
      call((api) => api.createWorkspace({ title: title.trim(), repository })),
    onSuccess: async (workspace) => {
      await queryClient.invalidateQueries({ queryKey: workspacesQuery.queryKey });
      await navigate({ to: "/workspaces/$workspaceId", params: { workspaceId: workspace.id } });
    },
  });

  const edit =
    <A,>(set: (value: A) => void) =>
    (value: A) => {
      create.reset();
      set(value);
    };

  const choices: Record<Source, RepositoryChoice | null> = {
    New: repositoryName ? { _tag: "New", name: repositoryName } : null,
    Existing: selected ? { _tag: "Existing", nameWithOwner: selected } : null,
  };
  const choice = choices[source];
  const repositoryError = create.error instanceof WorkspaceExists ? create.error : null;

  return (
    <Form.Root
      errors={repositoryError ? { repository: repositoryError.message } : {}}
      onFormSubmit={() => {
        if (title.trim() && choice) create.mutate(choice);
      }}
    >
      <Field.Root name="title">
        <Field.Label>Title</Field.Label>
        <Input.Root>
          <Input.Control
            autoFocus
            value={title}
            placeholder="Acme"
            onValueChange={edit(setTitle)}
          />
        </Input.Root>
      </Field.Root>

      <Field.Root name="repository">
        <Field.Label>Repository</Field.Label>
        <Tabs.Root value={source} onValueChange={edit(setSource)}>
          <Tabs.List>
            <Tabs.Tab value="New">New</Tabs.Tab>
            <Tabs.Tab value="Existing">Existing</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="New">
            <Input.Root>
              {login && <Input.Addon>{login}/</Input.Addon>}
              <Input.Control
                value={repositoryName}
                placeholder="acme"
                onValueChange={edit(setName)}
              />
              <Input.Addon>Private</Input.Addon>
            </Input.Root>
          </Tabs.Panel>
          <Tabs.Panel value="Existing">
            <RepositoryPicker selected={selected} onSelect={edit(setSelected)} />
          </Tabs.Panel>
        </Tabs.Root>
        <Field.Error />
      </Field.Root>

      {create.error && !repositoryError && <Form.Error>{create.error.message}</Form.Error>}

      <Actions>
        {children}
        <Button type="submit" disabled={!title.trim() || !choice || create.isPending}>
          {create.isPending ? "Creating…" : "Create workspace"}
        </Button>
      </Actions>
    </Form.Root>
  );
}
