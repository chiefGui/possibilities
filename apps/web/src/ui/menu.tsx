import { Menu } from "@base-ui/react/menu";
import * as stylex from "@stylexjs/stylex";
import { Check as CheckIcon } from "lucide-react";

import { border } from "@/theme/colors.stylex";
import { space } from "@/theme/tokens.stylex";
import { Icon } from "@/ui/icon";
import { popup } from "@/ui/popup";
import { row } from "@/ui/row";

export const Root = Menu.Root;

export const Trigger = Menu.Trigger;

export function Popup(props: Omit<Menu.Popup.Props, "className" | "style">) {
  return (
    <Menu.Portal>
      <Menu.Positioner align="start" sideOffset={4}>
        <Menu.Popup {...props} {...stylex.props(popup.root)} />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function LinkItem(props: Omit<Menu.LinkItem.Props, "className" | "style">) {
  return <Menu.LinkItem closeOnClick {...props} {...stylex.props(row.base, popup.item)} />;
}

export function Check() {
  return <Icon icon={CheckIcon} xstyle={[popup.indicator, styles.current]} />;
}

export function Separator() {
  return <Menu.Separator {...stylex.props(styles.separator)} />;
}

const styles = stylex.create({
  current: {
    visibility: { default: "hidden", ":is([aria-current=page] > *)": "visible" },
  },
  separator: {
    height: 1,
    marginBlock: space[1],
    marginInline: `calc(-1 * ${space[1]})`,
    backgroundColor: border.default,
  },
});
