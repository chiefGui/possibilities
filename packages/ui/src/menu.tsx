import { Menu } from "@base-ui/react/menu";

import { css } from "../styled-system/css";
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
          className={css(popup.root, popup.content)}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function LinkItem(props: Unstyled<Menu.LinkItem.Props>) {
  return <Menu.LinkItem closeOnClick {...props} className={css(row, popup.item)} />;
}

export function Check() {
  return <Icon name="selected" className={css(popup.indicator, current)} />;
}

export function Separator() {
  return <Menu.Separator className={css(popup.separator)} />;
}

const current = css.raw({
  visibility: "hidden",
  "[aria-current=page] > &": { visibility: "visible" },
});
