import * as stylex from "@stylexjs/stylex";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { colors, fonts } from "@/theme/tokens.stylex";

export const Route = createRootRoute({
  component: RootLayout,
});

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    minHeight: "100vh",
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: fonts.sans,
  },
});

function RootLayout() {
  return (
    <main {...stylex.props(styles.root)}>
      <Outlet />
    </main>
  );
}
