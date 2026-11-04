import { createFileRoute, redirect } from "@tanstack/react-router";

import { workspacesQuery } from "@/features/workspaces/queries";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const [last] = await context.queryClient.query(workspacesQuery);
    throw last
      ? redirect({ to: "/workspaces/$workspaceId", params: { workspaceId: last.id } })
      : redirect({ to: "/onboarding" });
  },
});
