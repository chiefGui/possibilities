import { Combobox } from "@base-ui/react/combobox";
import * as stylex from "@stylexjs/stylex";
import { X } from "lucide-react";

import { background, text } from "@/theme/colors.stylex";
import { radius, size, space } from "@/theme/tokens.stylex";
import { Icon } from "@/ui/icon";
import * as Input from "@/ui/input";
import { popup } from "@/ui/popup";
import { row } from "@/ui/row";

export const Root = Combobox.Root;

export const List = Combobox.List;

export function InputGroup(props: Omit<Combobox.InputGroup.Props, "className" | "style">) {
  return <Combobox.InputGroup {...props} render={<Input.Root />} />;
}

export function Control(props: Omit<Combobox.Input.Props, "className" | "style">) {
  return <Combobox.Input {...props} render={<Input.Control />} />;
}

export function Clear(props: Omit<Combobox.Clear.Props, "className" | "style" | "children">) {
  return (
    <Combobox.Clear {...props} {...stylex.props(styles.clear)}>
      <Icon icon={X} />
    </Combobox.Clear>
  );
}

export function Popup(props: Omit<Combobox.Popup.Props, "className" | "style">) {
  return (
    <Combobox.Portal>
      <Combobox.Positioner align="start" sideOffset={4}>
        <Combobox.Popup {...props} {...stylex.props(popup.root, styles.popup)} />
      </Combobox.Positioner>
    </Combobox.Portal>
  );
}

export function Item(props: Omit<Combobox.Item.Props, "className" | "style">) {
  return <Combobox.Item {...props} {...stylex.props(row.base, popup.item)} />;
}

export function Empty(props: Omit<Combobox.Empty.Props, "className" | "style">) {
  return <Combobox.Empty {...props} {...stylex.props(row.base, styles.empty)} />;
}

const styles = stylex.create({
  clear: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: size.line,
    height: size.line,
    marginInlineEnd: `calc(-1 * ${space[2]})`,
    padding: 0,
    borderWidth: 0,
    borderRadius: radius.sm,
    backgroundColor: { default: "transparent", ":hover": background.hovered },
  },
  popup: {
    width: "var(--anchor-width)",
    maxHeight: `min(var(--available-height), calc(8 * ${size.sm} + 2 * ${space[1]}))`,
    overflowY: "auto",
  },
  empty: {
    color: text.subtle,
    display: { default: "flex", ":empty": "none" },
  },
});
