import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { fontSizes, space } from "@/theme/tokens.stylex";

type CenteredPageProps = {
  title: string;
  above?: ReactNode;
  children: ReactNode;
};

export function CenteredPage({ title, above, children }: CenteredPageProps) {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.column)}>
        {above}
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        {children}
      </div>
    </div>
  );
}

const styles = stylex.create({
  page: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: space.xl,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    width: "100%",
    maxWidth: 420,
  },
  title: {
    margin: 0,
    fontSize: fontSizes.xl,
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
});
