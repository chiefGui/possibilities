import * as stylex from "@stylexjs/stylex";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { background, icon } from "@/theme/colors.stylex";
import { radius, size, space } from "@/theme/tokens.stylex";
import type { Unstyled } from "@/ui/props";
import { row } from "@/ui/row";
import { states } from "@/ui/states";
import { text } from "@/ui/text";

export function Root(props: Unstyled<ComponentProps<"nav">>) {
  return <nav {...props} {...stylex.props(styles.root)} />;
}

export function Header(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} {...stylex.props(styles.header)} />;
}

export function Section(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} {...stylex.props(styles.section)} />;
}

export function SectionHeader(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} {...stylex.props(text.label, styles.sectionHeader)} />;
}

function ActionAnchor(props: Unstyled<ComponentProps<"a">>) {
  return <a {...props} {...stylex.props(states.hover, states.ring, styles.action)} />;
}

const ActionLink = createLink(ActionAnchor);

export const Action: LinkComponent<typeof ActionAnchor> = (props) => <ActionLink {...props} />;

function Anchor(props: Unstyled<ComponentProps<"a">>) {
  return <a {...props} {...stylex.props(row.base, states.ring, styles.row)} />;
}

const ItemLink = createLink(Anchor);

export const Item: LinkComponent<typeof Anchor> = (props) => <ItemLink {...props} />;

export function Button(props: Unstyled<ComponentProps<"button">>) {
  return <button type="button" {...props} {...stylex.props(row.base, states.ring, styles.row)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space[4],
    width: size.sidebar,
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
  },
  row: {
    WebkitAppRegion: "no-drag",
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
    WebkitAppRegion: "no-drag",
  },
});
