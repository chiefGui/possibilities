import { useQuery } from "@tanstack/react-query";

import { syncQuery } from "@/features/workspaces/queries";
import { css } from "@possibilities/ui/css";
import { Icon } from "@possibilities/ui/icon";
import * as Sidebar from "@/layout/sidebar";
import * as Tooltip from "@possibilities/ui/tooltip";

export function SyncStatus({ workspaceId }: { workspaceId: string }) {
  const sync = useQuery(syncQuery(workspaceId));
  if (!sync.error) return null;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={<Sidebar.Button disabled={sync.isFetching} onClick={() => sync.refetch()} />}
      >
        <Icon name="failed" className={failed} />
        {sync.isFetching ? "Syncing…" : "Sync failed"}
      </Tooltip.Trigger>
      <Tooltip.Popup>{sync.error.message}</Tooltip.Popup>
    </Tooltip.Root>
  );
}

const failed = css({ color: "icon.danger" });
