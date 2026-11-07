import * as stylex from "@stylexjs/stylex";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { surface, text } from "@possibilities/ui/theme/colors.stylex";
import { font, fontSize } from "@possibilities/ui/theme/tokens.stylex";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

const styles = stylex.create({
  root: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: surface.sunken,
    color: text.default,
    fontFamily: font.sans,
    fontSize: fontSize.md,
    WebkitAppRegion: "drag",
  },
});

function RootLayout() {
  return (
    <main {...stylex.props(styles.root)}>
      <Outlet />
    </main>
  );
}
