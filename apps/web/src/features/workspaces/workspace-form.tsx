import { Tabs } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type RepositoryChoice, WorkspaceExists } from "@possibilities/contract";
import { useState } from "react";

import { environmentQuery } from "@/features/environment/queries";
import { workspacesQuery } from "@/features/workspaces/queries";
import { RepositoryPicker } from "@/features/workspaces/repository-picker";
import { call } from "@/rpc";
import { bg, fg } from "@/theme/colors.stylex";
import { radius, size, space, text, weight } from "@/theme/tokens.stylex";
import { Button } from "@/ui/button";
import { Actions } from "@/ui/actions";
import { Field, Form, FormError } from "@/ui/form";
import { Input } from "@/ui/input";

type Source = "New" | "Existing";

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type WorkspaceFormProps = {
  cancel?: { label: string; onClick: () => void };
};

export function WorkspaceForm({ cancel }: WorkspaceFormProps) {
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
    <Form
      errors={repositoryError ? { repository: repositoryError.message } : {}}
      onFormSubmit={() => {
        if (title.trim() && choice) create.mutate(choice);
      }}
    >
      <Field name="title" label="Title">
        <Input autoFocus value={title} placeholder="Acme" onValueChange={edit(setTitle)} />
      </Field>

      <Field name="repository" label="Repository">
        <Tabs.Root value={source} onValueChange={edit(setSource)}>
          <Tabs.List {...stylex.props(styles.tabs)}>
            {(["New", "Existing"] as const).map((value) => (
              <Tabs.Tab key={value} value={value} {...stylex.props(styles.tab)}>
                {value}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value="New" {...stylex.props(styles.panel)}>
            <Input
              value={repositoryName}
              placeholder="acme"
              start={login && `${login}/`}
              end="Private"
              onValueChange={edit(setName)}
            />
          </Tabs.Panel>
          <Tabs.Panel value="Existing" {...stylex.props(styles.panel)}>
            <RepositoryPicker selected={selected} onSelect={edit(setSelected)} />
          </Tabs.Panel>
        </Tabs.Root>
      </Field>

      {create.error && !repositoryError && <FormError>{create.error.message}</FormError>}

      <Actions>
        {cancel && (
          <Button type="button" variant="ghost" onClick={cancel.onClick}>
            {cancel.label}
          </Button>
        )}
        <Button type="submit" disabled={!title.trim() || !choice || create.isPending}>
          {create.isPending ? "Creating…" : "Create workspace"}
        </Button>
      </Actions>
    </Form>
  );
}

const styles = stylex.create({
  panel: {
    marginTop: space[2],
  },
  tabs: {
    display: "flex",
    gap: space[0.5],
    padding: space[0.5],
    borderRadius: radius.md,
    backgroundColor: bg.hover,
  },
  tab: {
    flex: 1,
    height: size.line,
    borderWidth: 0,
    borderRadius: radius.sm,
    fontFamily: "inherit",
    fontSize: text.sm,
    fontWeight: weight.medium,
    color: { default: fg.muted, ":is([data-active])": fg.default },
    backgroundColor: { default: "transparent", ":is([data-active])": bg.canvas },
    boxShadow: { default: "none", ":is([data-active])": "0 1px 2px oklch(0 0 0 / 8%)" },
  },
});
