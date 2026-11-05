import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { fontSize, size, space, weight } from "@/theme/tokens.stylex";
import type { Unstyled } from "@/ui/props";

export function Root({ children }: Pick<ComponentProps<"div">, "children">) {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.column)}>{children}</div>
    </div>
  );
}

export function Title(props: Unstyled<ComponentProps<"h1">>) {
  return <h1 {...props} {...stylex.props(styles.title)} />;
}

const styles = stylex.create({
  page: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: space[6],
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space[6],
    width: "100%",
    maxWidth: size.column,
    WebkitAppRegion: "no-drag",
  },
  title: {
    margin: 0,
    fontSize: fontSize.xl,
    fontWeight: weight.semibold,
    letterSpacing: "-0.01em",
  },
});
