import * as stylex from "@stylexjs/stylex";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { colors, fontSizes, fonts } from "@/theme/tokens.stylex";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

const styles = stylex.create({
  root: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: fonts.sans,
    fontSize: fontSizes.md,
  },
});

function RootLayout() {
  return (
    <main {...stylex.props(styles.root)}>
      <Outlet />
    </main>
  );
}
