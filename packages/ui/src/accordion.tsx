import { Accordion } from "@base-ui/react/accordion";

import { css } from "../styled-system/css";
import { Icon } from "./icon";
import type { Unstyled } from "./props";
import { row } from "./row";
import { states } from "./states";

export function Root(props: Unstyled<Accordion.Root.Props>) {
  return <Accordion.Root {...props} className={styles.root} />;
}

export function Item(props: Unstyled<Accordion.Item.Props>) {
  return <Accordion.Item {...props} className={styles.item} />;
}

export function Trigger({ children, ...props }: Unstyled<Accordion.Trigger.Props>) {
  return (
    <Accordion.Header className={styles.header}>
      <Accordion.Trigger {...props} className={css(row, states.hover, states.ring, styles.trigger)}>
        {children}
        <Icon name="expand" className={styles.chevron} />
      </Accordion.Trigger>
    </Accordion.Header>
  );
}

export function Panel(props: Unstyled<Accordion.Panel.Props>) {
  return <Accordion.Panel {...props} className={styles.panel} />;
}

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.default",
    borderRadius: "md",
    backgroundColor: "surface.raised",
    overflow: "hidden",
  }),
  item: css({
    borderTopWidth: { base: "1px", _first: 0 },
    borderTopStyle: "solid",
    borderTopColor: "border.default",
  }),
  header: css({
    margin: "0",
    padding: "1",
  }),
  trigger: css.raw({
    gap: "3",
    width: "full",
    height: "lg",
  }),
  chevron: css({
    opacity: "0",
    transitionProperty: "transform",
    transitionDuration: "fast",
    transitionTimingFunction: "standard",
    ":is(:hover, :focus-visible, [data-panel-open]) > &": { opacity: "1" },
    "[data-panel-open] > &": { transform: "rotate(90deg)" },
  }),
  panel: css({
    overflow: "hidden",
    height: { base: "var(--accordion-panel-height)", _transitioning: "0" },
    transitionProperty: "height",
    transitionDuration: "fast",
    transitionTimingFunction: "standard",
  }),
};
