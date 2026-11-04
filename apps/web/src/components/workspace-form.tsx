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
import { colors, dimensions, fontSizes, radii, space } from "@/theme/tokens.stylex";

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
    marginTop: space.sm,
  },
  tabs: {
    display: "flex",
    gap: space.xxs,
    padding: space.xxs,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
  },
  tab: {
    flex: 1,
    height: dimensions.line,
    borderWidth: 0,
    borderRadius: radii.sm,
    fontFamily: "inherit",
    fontSize: fontSizes.sm,
    fontWeight: 500,
    color: { default: colors.mutedForeground, ":is([data-active])": colors.foreground },
    backgroundColor: { default: "transparent", ":is([data-active])": colors.background },
    boxShadow: { default: "none", ":is([data-active])": "0 1px 2px oklch(0 0 0 / 8%)" },
  },
  picker: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: "hidden",
  },
  filter: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  repositories: {
    margin: 0,
    padding: space.xs,
    listStyle: "none",
    maxHeight: `calc(7 * ${dimensions.sm} + 2 * ${space.xs})`,
    overflowY: "auto",
  },
  repository: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    width: "100%",
    height: dimensions.sm,
    paddingInline: space.sm,
    borderWidth: 0,
    borderRadius: radii.sm,
    fontFamily: "inherit",
    fontSize: fontSizes.md,
    textAlign: "start",
    color: colors.foreground,
    backgroundColor: {
      default: "transparent",
      ":hover": colors.muted,
      ":is([aria-pressed=true])": colors.muted,
    },
    fontWeight: { default: 400, ":is([aria-pressed=true])": 500 },
  },
  badge: {
    fontSize: fontSizes.xs,
    color: colors.mutedForeground,
  },
  empty: {
    display: "flex",
    alignItems: "center",
    height: dimensions.sm,
    paddingInline: space.sm,
    color: colors.mutedForeground,
  },
  error: {
    color: colors.danger,
  },
});
