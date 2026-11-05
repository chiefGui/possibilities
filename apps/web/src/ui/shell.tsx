import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { border, surface } from "@/theme/colors.stylex";
import { radius, size, space, weight } from "@/theme/tokens.stylex";
import type { Unstyled } from "@/ui/props";

export function Root(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} {...stylex.props(styles.root)} />;
}

export function Main(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} {...stylex.props(styles.main)} />;
}

export function Header(props: Unstyled<ComponentProps<"header">>) {
  return <header {...props} {...stylex.props(styles.header)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flex: 1,
    height: "100vh",
    overflow: "hidden",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
    margin: space[2],
    marginInlineStart: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    borderRadius: radius.md,
    backgroundColor: surface.default,
    overflow: "hidden",
    WebkitAppRegion: "no-drag",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: space[3],
    flexShrink: 0,
    height: size.row,
    paddingInline: space[4],
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: border.default,
    fontWeight: weight.medium,
  },
});
