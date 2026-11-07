import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { OwnerScope } from "@/features/repositories/owner-scope";
import { repositoriesQuery, useOwner } from "@/features/repositories/queries";
import { css } from "@possibilities/ui/css";
import * as Combobox from "@possibilities/ui/combobox";

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
  const names = [...privacy.keys()];

  return (
    <OwnerScope
      value={owner}
      onValueChange={(next) => {
        setSelectedOwner(next);
        onValueChange(null);
      }}
    >
      <Combobox.Root
        items={repositories.isSuccess ? names : []}
        value={value}
        onValueChange={(next: string | null) => onValueChange(next)}
        itemToStringLabel={nameOf}
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
                {nameOf(item)}
                {privacy.get(item) && <span className={badge}>Private</span>}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Root>
    </OwnerScope>
  );
}

const badge = css({
  marginInlineStart: "auto",
  fontSize: "xs",
  color: "text.subtle",
});
