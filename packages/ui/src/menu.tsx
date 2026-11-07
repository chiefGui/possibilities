import { Menu } from "@base-ui/react/menu";
import * as stylex from "@stylexjs/stylex";

import { Icon } from "./icon";
import { popup, returnFocus, sideOffset } from "./popup";
import type { Unstyled } from "./props";
import { row } from "./row";

export const Root = Menu.Root;

export const Trigger = Menu.Trigger;

export function Popup(props: Unstyled<Menu.Popup.Props>) {
  return (
    <Menu.Portal>
      <Menu.Positioner align="start" sideOffset={sideOffset}>
        <Menu.Popup
          finalFocus={returnFocus}
          {...props}
          {...stylex.props(popup.root, popup.content)}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function LinkItem(props: Unstyled<Menu.LinkItem.Props>) {
  return <Menu.LinkItem closeOnClick {...props} {...stylex.props(row.base, popup.item)} />;
}

export function Check() {
  return <Icon name="selected" xstyle={[popup.indicator, styles.current]} />;
}

export function Separator() {
  return <Menu.Separator {...stylex.props(popup.separator)} />;
}

const styles = stylex.create({
  current: {
    visibility: { default: "hidden", ":is([aria-current=page] > *)": "visible" },
  },
});
