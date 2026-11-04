import * as stylex from "@stylexjs/stylex";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { background, border, icon, text } from "@/theme/colors.stylex";
import { fontSize, radius, ring, size, space, weight } from "@/theme/tokens.stylex";
import { row } from "@/ui/row";

type Props<T extends "nav" | "div" | "a" | "button"> = Omit<
  ComponentProps<T>,
  "className" | "style"
>;

export function Root(props: Props<"nav">) {
  return <nav {...props} {...stylex.props(styles.root)} />;
}

export function Header(props: Props<"div">) {
  return <div {...props} {...stylex.props(styles.header)} />;
}

export function Section(props: Props<"div">) {
  return <div {...props} {...stylex.props(styles.section)} />;
}

export function SectionHeader(props: Props<"div">) {
  return <div {...props} {...stylex.props(styles.sectionHeader)} />;
}

function ActionAnchor(props: Props<"a">) {
  return <a {...props} {...stylex.props(styles.focusable, styles.action)} />;
}

const ActionLink = createLink(ActionAnchor);

export const Action: LinkComponent<typeof ActionAnchor> = (props) => <ActionLink {...props} />;

function Anchor(props: Props<"a">) {
  return <a {...props} {...stylex.props(row.base, styles.focusable, styles.row)} />;
}

const ItemLink = createLink(Anchor);

export const Item: LinkComponent<typeof Anchor> = (props) => <ItemLink {...props} />;

export function Button(props: Props<"button">) {
  return (
    <button type="button" {...props} {...stylex.props(row.base, styles.focusable, styles.row)} />
  );
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
  header: {
    display: "flex",
    paddingInlineStart: {
      default: 0,
      ":is([data-platform=darwin] *)": `calc(${size.trafficLights} - ${space[2]})`,
    },
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: space[0.5],
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: size.sm,
    paddingInline: space[2],
    fontSize: fontSize.sm,
    fontWeight: weight.medium,
    color: text.subtle,
  },
  focusable: {
    WebkitAppRegion: "no-drag",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: ring.width,
    outlineColor: border.focused,
    outlineOffset: ring.offset,
  },
  row: {
    backgroundColor: {
      default: "transparent",
      ":hover": background.hovered,
      ":is([aria-current=page], [data-popup-open])": background.selected,
    },
  },
  action: {
    display: "grid",
    placeItems: "center",
    width: size.line,
    height: size.line,
    marginInlineEnd: `calc(-1 * ${space[1]})`,
    borderRadius: radius.sm,
    color: icon.subtle,
    backgroundColor: { default: "transparent", ":hover": background.hovered },
  },
});
