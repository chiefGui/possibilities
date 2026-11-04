import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { fontSize, space, weight } from "@/theme/tokens.stylex";

export function Root({ children }: Pick<ComponentProps<"div">, "children">) {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.column)}>{children}</div>
    </div>
  );
}

export function Title(props: Omit<ComponentProps<"h1">, "className" | "style">) {
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
    maxWidth: 420,
  },
  title: {
    margin: 0,
    fontSize: fontSize.xl,
    fontWeight: weight.semibold,
    letterSpacing: "-0.01em",
  },
});
