import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { OwnerScope } from "@/features/repositories/owner-scope";
import { repositoriesQuery, useOwner } from "@/features/repositories/queries";
import { text } from "@/theme/colors.stylex";
import { fontSize } from "@/theme/tokens.stylex";
import * as Combobox from "@/ui/combobox";

type RepositoryPickerProps = {
  value: string | null;
  onValueChange: (nameWithOwner: string | null) => void;
  noneLabel?: string;
};

const none = "";

const nameOf = (nameWithOwner: string) => nameWithOwner.slice(nameWithOwner.indexOf("/") + 1);

export function RepositoryPicker({ value, onValueChange, noneLabel }: RepositoryPickerProps) {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const owner = useOwner(selectedOwner);
  const repositories = useQuery({ ...repositoriesQuery(owner ?? ""), enabled: owner !== null });
  const privacy = new Map(
    repositories.data?.map((repository) => [repository.nameWithOwner, repository.isPrivate]),
  );
  const names = [...privacy.keys()];
  const labelOf = (item: string) => (item === none ? (noneLabel ?? "") : nameOf(item));

  return (
    <OwnerScope
      value={owner}
      onValueChange={(next) => {
        setSelectedOwner(next);
        onValueChange(null);
      }}
    >
      <Combobox.Root
        items={repositories.isSuccess ? (noneLabel ? [none, ...names] : names) : []}
        value={value ?? (noneLabel ? none : null)}
        onValueChange={(next: string | null) => onValueChange(next || null)}
        itemToStringLabel={labelOf}
      >
        <Combobox.Trigger aria-label="Repository" placeholder="Repository" disabled={!owner} />
        <Combobox.Popup>
          <Combobox.Search placeholder="Search repositories" />
          <Combobox.Empty>
            {repositories.isPending
              ? "Loading…"
              : (repositories.error?.message ?? "No repositories match")}
          </Combobox.Empty>
          <Combobox.List>
            {(item: string) => (
              <Combobox.Item key={item} value={item}>
                {labelOf(item)}
                {privacy.get(item) && <span {...stylex.props(styles.badge)}>Private</span>}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Root>
    </OwnerScope>
  );
}

const styles = stylex.create({
  badge: {
    marginInlineStart: "auto",
    fontSize: fontSize.xs,
    color: text.subtle,
  },
});
