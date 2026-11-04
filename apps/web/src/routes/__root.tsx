import * as stylex from "@stylexjs/stylex";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { ColorSchemeSwitcher } from "@/components/color-scheme-switcher";
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
  toolbar: {
    position: "fixed",
    top: space[3],
    right: space[3],
  },
});

function RootLayout() {
  return (
    <main {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.toolbar)}>
        <ColorSchemeSwitcher />
      </div>
      <Outlet />
    </main>
  );
}
