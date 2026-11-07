import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { RepositoryChoice } from "@possibilities/contract";
import { type ReactNode, useState } from "react";

import { workspacesQuery } from "@/features/workspaces/queries";
import { OwnerScope } from "@/features/repositories/owner-scope";
import { useOwner } from "@/features/repositories/queries";
import { RepositoryPicker } from "@/features/repositories/repository-picker";
import { call } from "@/rpc";
import { Actions } from "@possibilities/ui/actions";
import { Button } from "@possibilities/ui/button";
import * as Field from "@possibilities/ui/field";
import * as Form from "@possibilities/ui/form";
import * as Input from "@possibilities/ui/input";
import * as Tabs from "@possibilities/ui/tabs";

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
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(null);

  const owner = useOwner(selectedOwner);
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
    New: owner && repositoryName ? { _tag: "New", owner, name: repositoryName } : null,
    Existing: selectedRepository ? { _tag: "Existing", nameWithOwner: selectedRepository } : null,
  };
  const choice = choices[source];

  return (
    <Form.Root
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

      <Field.Group>
        <Field.Legend>Repository</Field.Legend>
        <Tabs.Root value={source} onValueChange={edit(setSource)}>
          <Tabs.List>
            <Tabs.Tab value="New">New</Tabs.Tab>
            <Tabs.Tab value="Existing">Existing</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="New">
            <OwnerScope value={owner} onValueChange={edit(setSelectedOwner)}>
              <Input.Root>
                <Input.Control
                  value={repositoryName}
                  placeholder="acme"
                  onValueChange={edit(setName)}
                />
                <Input.Addon>Private</Input.Addon>
              </Input.Root>
            </OwnerScope>
          </Tabs.Panel>
          <Tabs.Panel value="Existing">
            <RepositoryPicker
              value={selectedRepository}
              onValueChange={edit(setSelectedRepository)}
            />
          </Tabs.Panel>
        </Tabs.Root>
      </Field.Group>

      {create.error && <Form.Error>{create.error.message}</Form.Error>}

      <Actions>
        {children}
        <Button type="submit" disabled={!title.trim() || !choice || create.isPending}>
          {create.isPending ? "Creating…" : "Create workspace"}
        </Button>
      </Actions>
    </Form.Root>
  );
}
