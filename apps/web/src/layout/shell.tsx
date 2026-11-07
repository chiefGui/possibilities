import type { ComponentProps } from "react";

import { css } from "@possibilities/ui/css";
import type { Unstyled } from "@possibilities/ui/props";

export function Root(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} className={styles.root} />;
}

export function Main(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} className={styles.main} />;
}

export function Header(props: Unstyled<ComponentProps<"header">>) {
  return <header {...props} className={styles.header} />;
}

const styles = {
  root: css({
    display: "flex",
    flex: "1",
    height: "screen",
    overflow: "hidden",
  }),
  main: css({
    display: "flex",
    flexDirection: "column",
    flex: "1",
    minWidth: "0",
    margin: "2",
    marginInlineStart: "0",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.default",
    borderRadius: "md",
    backgroundColor: "surface.default",
    overflow: "hidden",
    appRegion: "no-drag",
  }),
  header: css({
    display: "flex",
    alignItems: "center",
    gap: "3",
    flexShrink: 0,
    height: "row",
    paddingInline: "4",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "border.default",
    fontWeight: "medium",
  }),
};
