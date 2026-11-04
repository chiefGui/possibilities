import { Accordion } from "@base-ui/react/accordion";
import * as stylex from "@stylexjs/stylex";
import { ChevronRight } from "lucide-react";

import { background, border, icon, surface, text } from "@/theme/colors.stylex";
import { fontSize, motion, radius, size, space } from "@/theme/tokens.stylex";

export function Root(props: Omit<Accordion.Root.Props, "className" | "style">) {
  return <Accordion.Root {...props} {...stylex.props(styles.root)} />;
}

export function Item(props: Omit<Accordion.Item.Props, "className" | "style">) {
  return <Accordion.Item {...props} {...stylex.props(styles.item)} />;
}

export function Trigger({
  children,
  ...props
}: Omit<Accordion.Trigger.Props, "className" | "style">) {
  return (
    <Accordion.Header {...stylex.props(styles.header)}>
      <Accordion.Trigger {...props} {...stylex.props(styles.trigger)}>
        {children}
        <ChevronRight aria-hidden {...stylex.props(styles.chevron)} />
      </Accordion.Trigger>
    </Accordion.Header>
  );
}

export function Panel(props: Omit<Accordion.Panel.Props, "className" | "style">) {
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
    display: "flex",
    alignItems: "center",
    gap: space[3],
    width: "100%",
    height: size.lg,
    paddingInline: space[2],
    borderWidth: 0,
    borderRadius: radius.sm,
    fontFamily: "inherit",
    fontSize: fontSize.md,
    color: text.default,
    backgroundColor: { default: "transparent", ":hover": background.hovered },
    outlineStyle: "none",
  },
  chevron: {
    width: size.icon,
    height: size.icon,
    flexShrink: 0,
    color: icon.subtle,
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
