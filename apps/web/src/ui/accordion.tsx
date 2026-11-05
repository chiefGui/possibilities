import { Accordion } from "@base-ui/react/accordion";
import * as stylex from "@stylexjs/stylex";
import { ChevronRight } from "lucide-react";

import { border, surface } from "@/theme/colors.stylex";
import { motion, radius, size, space } from "@/theme/tokens.stylex";
import { Icon } from "@/ui/icon";
import type { Unstyled } from "@/ui/props";
import { row } from "@/ui/row";
import { states } from "@/ui/states";

export function Root(props: Unstyled<Accordion.Root.Props>) {
  return <Accordion.Root {...props} {...stylex.props(styles.root)} />;
}

export function Item(props: Unstyled<Accordion.Item.Props>) {
  return <Accordion.Item {...props} {...stylex.props(styles.item)} />;
}

export function Trigger({ children, ...props }: Unstyled<Accordion.Trigger.Props>) {
  return (
    <Accordion.Header {...stylex.props(styles.header)}>
      <Accordion.Trigger
        {...props}
        {...stylex.props(row.base, states.hover, states.ring, styles.trigger)}
      >
        {children}
        <Icon icon={ChevronRight} xstyle={styles.chevron} />
      </Accordion.Trigger>
    </Accordion.Header>
  );
}

export function Panel(props: Unstyled<Accordion.Panel.Props>) {
  return <Accordion.Panel {...props} {...stylex.props(styles.panel)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    borderRadius: radius.md,
    backgroundColor: surface.raised,
    overflow: "hidden",
  },
  item: {
    borderTopWidth: { default: 1, ":first-child": 0 },
    borderTopStyle: "solid",
    borderTopColor: border.default,
  },
  header: {
    margin: 0,
    padding: space[1],
  },
  trigger: {
    gap: space[3],
    width: "100%",
    height: size.lg,
  },
  chevron: {
    opacity: {
      default: 0,
      ":is(:hover > *)": 1,
      ":is(:focus-visible > *)": 1,
      ":is([data-panel-open] > *)": 1,
    },
    transform: { default: "rotate(0deg)", ":is([data-panel-open] > *)": "rotate(90deg)" },
    transitionProperty: "transform",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.easing,
  },
  panel: {
    overflow: "hidden",
    height: {
      default: "var(--accordion-panel-height)",
      ":is([data-starting-style], [data-ending-style])": 0,
    },
    transitionProperty: "height",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.easing,
  },
});
