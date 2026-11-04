import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { OwnerSelect } from "@/features/repositories/owner-select";
import { repositoriesQuery, useOwner } from "@/features/repositories/queries";
import { text } from "@/theme/colors.stylex";
import { fontSize } from "@/theme/tokens.stylex";
import * as Combobox from "@/ui/combobox";
import * as Input from "@/ui/input";

type RepositoryPickerProps = {
  value: string | null;
  onValueChange: (nameWithOwner: string | null) => void;
};

const nameOf = (nameWithOwner: string) => nameWithOwner.slice(nameWithOwner.indexOf("/") + 1);

export function RepositoryPicker({ value, onValueChange }: RepositoryPickerProps) {
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const owner = useOwner(selectedOwner);
  const repositories = useQuery({ ...repositoriesQuery(owner ?? ""), enabled: owner !== null });
  const privacy = new Map(
    repositories.data?.map((repository) => [repository.nameWithOwner, repository.isPrivate]),
  );

  return (
    <Combobox.Root
      items={[...privacy.keys()]}
      value={value}
      onValueChange={(next: string | null) => onValueChange(next)}
      itemToStringLabel={nameOf}
    >
      <Combobox.InputGroup>
        <OwnerSelect
          value={owner}
          onValueChange={(next) => {
            setSelectedOwner(next);
            onValueChange(null);
          }}
        />
        <Input.Addon>/</Input.Addon>
        <Combobox.Control placeholder="Search repositories" />
        {value && <Combobox.Clear aria-label="Clear repository" />}
      </Combobox.InputGroup>
      <Combobox.Popup>
        <Combobox.Empty>
          {repositories.isPending
            ? "Loading…"
            : (repositories.error?.message ?? "No repositories match")}
        </Combobox.Empty>
        <Combobox.List>
          {(nameWithOwner: string) => (
            <Combobox.Item key={nameWithOwner} value={nameWithOwner}>
              {nameOf(nameWithOwner)}
              {privacy.get(nameWithOwner) && <span {...stylex.props(styles.badge)}>Private</span>}
            </Combobox.Item>
          )}
        </Combobox.List>
      </Combobox.Popup>
    </Combobox.Root>
  );
}

const styles = stylex.create({
  badge: {
    marginInlineStart: "auto",
    fontSize: fontSize.xs,
    color: text.subtle,
  },
});
