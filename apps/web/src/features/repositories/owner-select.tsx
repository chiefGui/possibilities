import { useQuery } from "@tanstack/react-query";

import { ownersQuery } from "@/features/repositories/queries";
import * as Select from "@/ui/select";

type OwnerSelectProps = {
  value: string | null;
  onValueChange: (owner: string) => void;
};

export function OwnerSelect({ value, onValueChange }: OwnerSelectProps) {
  const owners = useQuery(ownersQuery).data ?? [];

  return (
    <Select.Root
      value={value}
      onValueChange={(owner) => {
        if (owner) onValueChange(owner);
      }}
    >
      <Select.Trigger aria-label="Owner" disabled={!value} />
      <Select.Popup>
        {owners.map((owner) => (
          <Select.Item key={owner} value={owner}>
            {owner}
          </Select.Item>
        ))}
      </Select.Popup>
    </Select.Root>
  );
}
