import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { space } from "@/theme/tokens.stylex";

export function Actions({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.actions)}>{children}</div>;
}

const styles = stylex.create({
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: space[2],
  },
});
