import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";

import { syncQuery } from "@/features/workspaces/queries";
import { icon } from "@possibilities/ui/theme/colors.stylex";
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
        <Icon name="failed" xstyle={styles.failed} />
        {sync.isFetching ? "Syncing…" : "Sync failed"}
      </Tooltip.Trigger>
      <Tooltip.Popup>{sync.error.message}</Tooltip.Popup>
    </Tooltip.Root>
  );
}

const styles = stylex.create({
  failed: { color: icon.danger },
});
