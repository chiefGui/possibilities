import { Menu } from "@base-ui/react/menu";

import { css } from "../styled-system/css";
import { Icon } from "./icon";
import { popup, returnFocus, sideOffset } from "./popup";
import type { Unstyled } from "./props";
import { row } from "./row";

export const Root = Menu.Root;

export const Trigger = Menu.Trigger;

type PopupProps = Unstyled<Menu.Popup.Props> & Pick<Menu.Positioner.Props, "align">;

export function Popup({ align = "start", ...props }: PopupProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner align={align} sideOffset={sideOffset}>
        <Menu.Popup
          finalFocus={returnFocus}
          {...props}
          className={css(popup.root, popup.content)}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function Item(props: Unstyled<Menu.Item.Props>) {
  return <Menu.Item {...props} className={css(row, popup.item)} />;
}

type CheckboxItemProps = Unstyled<Menu.CheckboxItem.Props> & { shortcut?: string };

export function CheckboxItem({ children, shortcut, ...props }: CheckboxItemProps) {
  return (
    <Menu.CheckboxItem {...props} className={css(row, popup.item)}>
      {children}
      {shortcut && <kbd className={css(popup.indicator, styles.shortcut)}>{shortcut}</kbd>}
      <Menu.CheckboxItemIndicator
        keepMounted
        className={css(shortcut ? styles.trailing : popup.indicator, styles.checkbox)}
      >
        <Icon name="selected" />
      </Menu.CheckboxItemIndicator>
    </Menu.CheckboxItem>
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

const styles = {
  checkbox: css.raw({
    display: "flex",
    visibility: "hidden",
    "&[data-checked]": { visibility: "visible" },
  }),
  trailing: css.raw({
    marginInlineStart: "2",
  }),
  shortcut: css.raw({
    fontFamily: "inherit",
    fontSize: "sm",
    color: "text.subtle",
  }),
};

const current = css.raw({
  visibility: "hidden",
  "[aria-current=page] > &": { visibility: "visible" },
});
