import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { css } from "@possibilities/ui/css";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

const root = css({
  display: "flex",
  minHeight: "screen",
  backgroundColor: "surface.sunken",
  color: "text.default",
  fontFamily: "sans",
  fontSize: "md",
  appRegion: "drag",
});

function RootLayout() {
  return (
    <main className={root}>
      <Outlet />
    </main>
  );
}
