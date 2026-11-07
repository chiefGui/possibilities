import type { ComponentProps } from "react";

import { css } from "@possibilities/ui/css";
import type { Unstyled } from "@possibilities/ui/props";

export function Root({ children }: Pick<ComponentProps<"div">, "children">) {
  return (
    <div className={styles.page}>
      <div className={styles.column}>{children}</div>
    </div>
  );
}

export function Title(props: Unstyled<ComponentProps<"h1">>) {
  return <h1 {...props} className={styles.title} />;
}

const styles = {
  page: css({
    display: "flex",
    flex: "1",
    alignItems: "center",
    justifyContent: "center",
    padding: "6",
  }),
  column: css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
    width: "full",
    maxWidth: "column",
    appRegion: "no-drag",
  }),
  title: css({
    margin: "0",
    fontSize: "xl",
    fontWeight: "semibold",
    letterSpacing: "-0.01em",
  }),
};
