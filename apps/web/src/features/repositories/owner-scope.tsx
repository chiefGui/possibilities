import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { ownersQuery } from "@/features/repositories/queries";
import { css } from "@possibilities/ui/css";
import * as Combobox from "@possibilities/ui/combobox";

type OwnerScopeProps = {
  value: string | null;
  onValueChange: (owner: string) => void;
  children: ReactNode;
};

export function OwnerScope({ value, onValueChange, children }: OwnerScopeProps) {
  const owners = useQuery(ownersQuery).data ?? [];

  return (
    <div className={scope}>
      <Combobox.Root
        items={owners}
        value={value}
        onValueChange={(owner: string | null) => {
          if (owner) onValueChange(owner);
        }}
      >
        <Combobox.Trigger aria-label="Owner" placeholder="Owner" disabled={!value} />
        <Combobox.Popup>
          <Combobox.Search placeholder="Search owners" />
          <Combobox.Empty>No owners match</Combobox.Empty>
          <Combobox.List>
            {(owner: string) => (
              <Combobox.Item key={owner} value={owner}>
                {owner}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Root>
      {children}
    </div>
  );
}

const scope = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, auto) minmax(0, 1fr)",
  gap: "2",
});
