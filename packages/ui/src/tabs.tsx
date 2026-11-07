import { Tabs } from "@base-ui/react/tabs";

import { css } from "../styled-system/css";
import type { Unstyled } from "./props";
import { states } from "./states";

export const Root = Tabs.Root;

export function List(props: Unstyled<Tabs.List.Props>) {
  return <Tabs.List {...props} className={styles.list} />;
}

export function Tab(props: Unstyled<Tabs.Tab.Props>) {
  return <Tabs.Tab {...props} className={css(states.ring, styles.tab)} />;
}

export function Panel(props: Unstyled<Tabs.Panel.Props>) {
  return <Tabs.Panel {...props} className={styles.panel} />;
}

const styles = {
  list: css({
    display: "flex",
    gap: "0.5",
    padding: "0.5",
    borderRadius: "md",
    backgroundColor: "background.neutral",
  }),
  tab: css.raw({
    flex: 1,
    height: "line",
    borderWidth: 0,
    borderRadius: "sm",
    fontFamily: "inherit",
    fontSize: "sm",
    fontWeight: "medium",
    color: "text.subtle",
    backgroundColor: "transparent",
    "&[data-active]": {
      color: "text.default",
      backgroundColor: "surface.default",
      boxShadow: "raised",
    },
  }),
  panel: css({
    marginTop: "2",
  }),
};
