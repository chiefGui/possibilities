import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { space, text, weight } from "@/theme/tokens.stylex";

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
    fontSize: text.xl,
    fontWeight: weight.semibold,
    letterSpacing: "-0.01em",
  },
});
