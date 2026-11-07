import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { css } from "@possibilities/ui/css";
import type { Unstyled } from "@possibilities/ui/props";
import { row } from "@possibilities/ui/row";
import { states } from "@possibilities/ui/states";
import { text } from "@possibilities/ui/text";

export function Root(props: Unstyled<ComponentProps<"nav">>) {
  return <nav {...props} className={styles.root} />;
}

export function Header(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} className={styles.header} />;
}

export function Section(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} className={css(styles.section)} />;
}

export function Footer(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} className={css(styles.section, styles.footer)} />;
}

export function SectionHeader(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} className={css(text.label, styles.sectionHeader)} />;
}

function ActionAnchor(props: Unstyled<ComponentProps<"a">>) {
  return <a {...props} className={css(states.hover, states.ring, styles.action)} />;
}

const ActionLink = createLink(ActionAnchor);

export const Action: LinkComponent<typeof ActionAnchor> = (props) => <ActionLink {...props} />;

function Anchor(props: Unstyled<ComponentProps<"a">>) {
  return <a {...props} className={css(row, states.ring, styles.row)} />;
}

const ItemLink = createLink(Anchor);

export const Item: LinkComponent<typeof Anchor> = (props) => <ItemLink {...props} />;

export function Button(props: Unstyled<ComponentProps<"button">>) {
  return <button type="button" {...props} className={css(row, states.ring, styles.row)} />;
}

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    gap: "4",
    width: "sidebar",
    flexShrink: 0,
    padding: "2",
  }),
  header: css({
    display: "flex",
    "[data-platform=darwin] &": {
      paddingInlineStart: "[calc({sizes.trafficLights} - {spacing.2})]",
    },
  }),
  section: css.raw({
    display: "flex",
    flexDirection: "column",
    gap: "0.5",
  }),
  footer: css.raw({
    marginBlockStart: "auto",
  }),
  sectionHeader: css.raw({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "sm",
    paddingInline: "2",
  }),
  row: css.raw({
    appRegion: "no-drag",
    backgroundColor: "transparent",
    "&:hover:not([aria-current=page], [data-popup-open])": {
      backgroundColor: "background.hovered",
    },
    "&:is([aria-current=page], [data-popup-open])": { backgroundColor: "background.selected" },
  }),
  action: css.raw({
    display: "grid",
    placeItems: "center",
    width: "line",
    height: "line",
    marginInlineEnd: "-1",
    borderRadius: "sm",
    color: "icon.subtle",
    appRegion: "no-drag",
  }),
};
