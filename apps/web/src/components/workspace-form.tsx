import { Tabs } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type RepositoryChoice, WorkspaceExists } from "@possibilities/contract";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Form, FormActions, FormError } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { environmentQuery, repositoriesQuery, workspacesQuery } from "@/queries";
import { call } from "@/rpc";
import { bg, border, fg, status } from "@/theme/colors.stylex";
import { radius, size, space, text, weight } from "@/theme/tokens.stylex";

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

      <FormActions>
        {cancel && (
          <Button type="button" variant="ghost" onClick={cancel.onClick}>
            {cancel.label}
          </Button>
        )}
        <Button type="submit" disabled={!title.trim() || !choice || create.isPending}>
          {create.isPending ? "Creating…" : "Create workspace"}
        </Button>
      </FormActions>
    </Form>
  );
}

type RepositoryPickerProps = {
  selected: string | null;
  onSelect: (nameWithOwner: string) => void;
};

function RepositoryPicker({ selected, onSelect }: RepositoryPickerProps) {
  const [filter, setFilter] = useState("");
  const repositories = useQuery(repositoriesQuery);
  const matches = (repositories.data ?? []).filter((repository) =>
    repository.nameWithOwner.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div {...stylex.props(styles.picker)}>
      <Input
        value={filter}
        placeholder="Filter repositories"
        onValueChange={setFilter}
        xstyle={styles.filter}
      />
      <ul {...stylex.props(styles.repositories)}>
        {repositories.isPending && <li {...stylex.props(styles.empty)}>Loading…</li>}
        {repositories.error && (
          <li {...stylex.props(styles.empty, styles.error)}>{repositories.error.message}</li>
        )}
        {repositories.isSuccess && matches.length === 0 && (
          <li {...stylex.props(styles.empty)}>No repositories match</li>
        )}
        {matches.map((repository) => (
          <li key={repository.nameWithOwner}>
            <button
              type="button"
              aria-pressed={repository.nameWithOwner === selected}
              onClick={() => onSelect(repository.nameWithOwner)}
              {...stylex.props(styles.repository)}
            >
              <span>{repository.nameWithOwner}</span>
              {repository.isPrivate && <span {...stylex.props(styles.badge)}>Private</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
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
  picker: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  filter: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  repositories: {
    margin: 0,
    padding: space[1],
    listStyle: "none",
    maxHeight: `calc(7 * ${size.sm} + 2 * ${space[1]})`,
    overflowY: "auto",
  },
  repository: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space[2],
    width: "100%",
    height: size.sm,
    paddingInline: space[2],
    borderWidth: 0,
    borderRadius: radius.sm,
    fontFamily: "inherit",
    fontSize: text.md,
    textAlign: "start",
    color: fg.default,
    backgroundColor: {
      default: "transparent",
      ":hover": bg.hover,
      ":is([aria-pressed=true])": bg.hover,
    },
    fontWeight: { default: null, ":is([aria-pressed=true])": weight.medium },
  },
  badge: {
    fontSize: text.xs,
    color: fg.muted,
  },
  empty: {
    display: "flex",
    alignItems: "center",
    height: size.sm,
    paddingInline: space[2],
    color: fg.muted,
  },
  error: {
    color: status.danger,
  },
});
