import * as stylex from "@stylexjs/stylex";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { bg, fg } from "@/theme/colors.stylex";
import { font, text } from "@/theme/tokens.stylex";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

const styles = stylex.create({
  root: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: bg.canvas,
    color: fg.default,
    fontFamily: font.sans,
    fontSize: text.md,
  },
});

function RootLayout() {
  return (
    <main {...stylex.props(styles.root)}>
      <Outlet />
    </main>
  );
}
