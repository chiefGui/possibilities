import { Combobox } from "@base-ui/react/combobox";
import * as stylex from "@stylexjs/stylex";
import { Check, ChevronDown, X } from "lucide-react";

import { background, text } from "@/theme/colors.stylex";
import { radius, size, space } from "@/theme/tokens.stylex";
import { Icon } from "@/ui/icon";
import * as Input from "@/ui/input";
import { popup } from "@/ui/popup";
import { row } from "@/ui/row";

export const Root: typeof Combobox.Root = (props) => <Combobox.Root autoHighlight {...props} />;

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

export function Trigger(props: Omit<Combobox.Trigger.Props, "className" | "style" | "children">) {
  return (
    <Combobox.Trigger {...props} {...stylex.props(row.base, styles.trigger)}>
      <Combobox.Value />
      <Icon icon={ChevronDown} />
    </Combobox.Trigger>
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

export function Search(props: Omit<Combobox.Input.Props, "className" | "style">) {
  return <Combobox.Input {...props} {...stylex.props(popup.search)} />;
}

export function List(props: Omit<Combobox.List.Props, "className" | "style">) {
  return <Combobox.List {...props} {...stylex.props(styles.list)} />;
}

export function Item({ children, ...props }: Omit<Combobox.Item.Props, "className" | "style">) {
  return (
    <Combobox.Item {...props} {...stylex.props(row.base, popup.item)}>
      {children}
      <Combobox.ItemIndicator render={<Icon icon={Check} xstyle={popup.indicator} />} />
    </Combobox.Item>
  );
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
  trigger: {
    flexShrink: 0,
    gap: space[1],
    height: size.line,
    marginInline: `calc(-1 * ${space[2]})`,
    fontSize: "inherit",
    backgroundColor: {
      default: "transparent",
      ":hover": background.hovered,
      ":is([data-popup-open])": background.hovered,
    },
  },
  popup: {
    minWidth: `max(${size.popup}, var(--anchor-width))`,
    maxHeight: `min(var(--available-height), calc(10 * ${size.md}))`,
    overflow: "hidden",
  },
  list: {
    minHeight: 0,
    overflowY: "auto",
  },
  empty: {
    height: size.md,
    color: text.subtle,
    display: { default: "flex", ":empty": "none" },
  },
});
