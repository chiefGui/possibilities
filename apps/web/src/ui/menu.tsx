import { Menu } from "@base-ui/react/menu";
import * as stylex from "@stylexjs/stylex";
import { Check as CheckIcon } from "lucide-react";

import { background, border, surface, text } from "@/theme/colors.stylex";
import { font, fontSize, radius, shadow, size, space } from "@/theme/tokens.stylex";
import { Icon } from "@/ui/icon";

export const Root = Menu.Root;

export const Trigger = Menu.Trigger;

export function Popup(props: Omit<Menu.Popup.Props, "className" | "style">) {
  return (
    <Menu.Portal>
      <Menu.Positioner side="bottom" align="start" sideOffset={4}>
        <Menu.Popup {...props} {...stylex.props(styles.popup)} />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export function LinkItem(props: Omit<Menu.LinkItem.Props, "className" | "style">) {
  return <Menu.LinkItem closeOnClick {...props} {...stylex.props(styles.item)} />;
}

export function Check() {
  return <Icon icon={CheckIcon} xstyle={styles.check} />;
}

export function Separator() {
  return <Menu.Separator {...stylex.props(styles.separator)} />;
}

const styles = stylex.create({
  popup: {
    display: "flex",
    flexDirection: "column",
    minWidth: 220,
    padding: space[1],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    borderRadius: radius.md,
    backgroundColor: surface.raised,
    boxShadow: shadow.overlay,
    fontFamily: font.sans,
    outlineStyle: "none",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: space[2],
    height: size.sm,
    paddingInline: space[2],
    borderRadius: radius.sm,
    fontSize: fontSize.md,
    color: text.default,
    textDecoration: "none",
    userSelect: "none",
    backgroundColor: { default: "transparent", ":is([data-highlighted])": background.hovered },
    outlineStyle: "none",
  },
  check: {
    marginInlineStart: "auto",
    visibility: { default: "hidden", ":is([aria-current=page] > *)": "visible" },
  },
  separator: {
    height: 1,
    marginBlock: space[1],
    marginInline: `calc(-1 * ${space[1]})`,
    backgroundColor: border.default,
  },
});
