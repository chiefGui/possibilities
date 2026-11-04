import { Tabs } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";

import { background, surface, text } from "@/theme/colors.stylex";
import { fontSize, radius, shadow, size, space, weight } from "@/theme/tokens.stylex";

export function Root(props: Omit<Tabs.Root.Props, "className" | "style">) {
  return <Tabs.Root {...props} />;
}

export function List(props: Omit<Tabs.List.Props, "className" | "style">) {
  return <Tabs.List {...props} {...stylex.props(styles.list)} />;
}

export function Tab(props: Omit<Tabs.Tab.Props, "className" | "style">) {
  return <Tabs.Tab {...props} {...stylex.props(styles.tab)} />;
}

export function Panel(props: Omit<Tabs.Panel.Props, "className" | "style">) {
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
