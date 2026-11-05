import { useQuery } from "@tanstack/react-query";

import { ownersQuery } from "@/features/repositories/queries";
import * as Combobox from "@/ui/combobox";

type OwnerPickerProps = {
  value: string | null;
  onValueChange: (owner: string) => void;
};

export function OwnerPicker({ value, onValueChange }: OwnerPickerProps) {
  const owners = useQuery(ownersQuery).data ?? [];

  return (
    <Combobox.Root
      items={owners}
      value={value}
      onValueChange={(owner: string | null) => {
        if (owner) onValueChange(owner);
      }}
    >
      <Combobox.Trigger aria-label="Owner" disabled={!value} />
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
  );
}
