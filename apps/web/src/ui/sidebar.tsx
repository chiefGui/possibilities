import * as stylex from "@stylexjs/stylex";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { background, border, text } from "@/theme/colors.stylex";
import { fontSize, radius, ring, size, space } from "@/theme/tokens.stylex";

type Props<T extends "nav" | "div" | "a" | "button"> = Omit<
  ComponentProps<T>,
  "className" | "style"
>;

export function Root(props: Props<"nav">) {
  return <nav {...props} {...stylex.props(styles.root)} />;
}

export function Section(props: Props<"div">) {
  return <div {...props} {...stylex.props(styles.section)} />;
}

function Anchor(props: Props<"a">) {
  return <a {...props} {...stylex.props(styles.row)} />;
}

const ItemLink = createLink(Anchor);

export const Item: LinkComponent<typeof Anchor> = (props) => <ItemLink {...props} />;

export function Button(props: Props<"button">) {
  return <button type="button" {...props} {...stylex.props(styles.row, styles.button)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space[4],
    width: 240,
    flexShrink: 0,
    padding: space[2],
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: space[0.5],
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: space[2],
    minWidth: 0,
    height: size.sm,
    paddingInline: space[2],
    borderRadius: radius.sm,
    fontSize: fontSize.md,
    color: text.default,
    textDecoration: "none",
    userSelect: "none",
    backgroundColor: {
      default: "transparent",
      ":hover": background.hovered,
      ":is([aria-current=page], [data-popup-open])": background.selected,
    },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: ring.width,
    outlineColor: border.focused,
    outlineOffset: ring.offset,
  },
  button: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    borderWidth: 0,
    fontFamily: "inherit",
  },
});
