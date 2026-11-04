import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { repositoriesQuery } from "@/features/workspaces/queries";
import { bg, border, fg, status } from "@/theme/colors.stylex";
import { radius, size, space, text, weight } from "@/theme/tokens.stylex";
import * as Input from "@/ui/input";

type RepositoryPickerProps = {
  selected: string | null;
  onSelect: (nameWithOwner: string) => void;
};

export function RepositoryPicker({ selected, onSelect }: RepositoryPickerProps) {
  const [filter, setFilter] = useState("");
  const repositories = useQuery(repositoriesQuery);
  const matches = (repositories.data ?? []).filter((repository) =>
    repository.nameWithOwner.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div {...stylex.props(styles.picker)}>
      <Input.Root xstyle={styles.filter}>
        <Input.Control value={filter} placeholder="Filter repositories" onValueChange={setFilter} />
      </Input.Root>
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
