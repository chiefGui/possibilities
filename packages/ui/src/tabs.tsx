import { Tabs } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";

import { background, surface, text } from "./theme/colors.stylex";
import { fontSize, radius, shadow, size, space, weight } from "./theme/tokens.stylex";
import type { Unstyled } from "./props";
import { states } from "./states";

export const Root = Tabs.Root;

export function List(props: Unstyled<Tabs.List.Props>) {
  return <Tabs.List {...props} {...stylex.props(styles.list)} />;
}

export function Tab(props: Unstyled<Tabs.Tab.Props>) {
  return <Tabs.Tab {...props} {...stylex.props(states.ring, styles.tab)} />;
}

export function Panel(props: Unstyled<Tabs.Panel.Props>) {
  return <Tabs.Panel {...props} {...stylex.props(styles.panel)} />;
}

const styles = stylex.create({
  list: {
    display: "flex",
    gap: space[0.5],
    padding: space[0.5],
    borderRadius: radius.md,
    backgroundColor: background.neutral,
  },
  tab: {
    flex: 1,
    height: size.line,
    borderWidth: 0,
    borderRadius: radius.sm,
    fontFamily: "inherit",
    fontSize: fontSize.sm,
    fontWeight: weight.medium,
    color: { default: text.subtle, ":is([data-active])": text.default },
    backgroundColor: { default: "transparent", ":is([data-active])": surface.default },
    boxShadow: { default: "none", ":is([data-active])": shadow.raised },
  },
  panel: {
    marginTop: space[2],
  },
});
