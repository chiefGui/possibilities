import { createFileRoute } from "@tanstack/react-router";

import * as Shell from "@/layout/shell";

export const Route = createFileRoute("/workspaces/$workspaceId/")({
  component: () => <Shell.Header>Home</Shell.Header>,
});
