import { Tabs } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";

import { bg, fg } from "@/theme/colors.stylex";
import { radius, shadow, size, space, text, weight } from "@/theme/tokens.stylex";

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
    backgroundColor: bg.hover,
  },
  tab: {
    flex: 1,
    height: size.line,
    borderWidth: 0,
    borderRadius: radius.sm,
    fontFamily: "inherit",
    fontSize: text.sm,
    fontWeight: weight.medium,
    color: { default: fg.muted, ":is([data-active])": fg.default },
    backgroundColor: { default: "transparent", ":is([data-active])": bg.canvas },
    boxShadow: { default: "none", ":is([data-active])": shadow.sm },
  },
  panel: {
    marginTop: space[2],
  },
});
