import * as stylex from "@stylexjs/stylex";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { bg, fg } from "@/theme/colors.stylex";
import { font, space } from "@/theme/tokens.stylex";

export const Route = createRootRoute({
  component: RootLayout,
});

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space[4],
    minHeight: "100vh",
    backgroundColor: bg.canvas,
    color: fg.default,
    fontFamily: font.sans,
  },
});

function RootLayout() {
  return (
    <main {...stylex.props(styles.root)}>
      <Outlet />
    </main>
  );
}
