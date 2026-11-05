import { Combobox } from "@base-ui/react/combobox";
import * as stylex from "@stylexjs/stylex";
import { Check, ChevronDown } from "lucide-react";

import { text } from "@/theme/colors.stylex";
import { size, space } from "@/theme/tokens.stylex";
import { control } from "@/ui/control";
import { Icon } from "@/ui/icon";
import { popup, returnFocus } from "@/ui/popup";
import { row } from "@/ui/row";
import * as ScrollArea from "@/ui/scroll-area";

export const Root: typeof Combobox.Root = (props) => <Combobox.Root autoHighlight {...props} />;

type TriggerProps = Omit<Combobox.Trigger.Props, "className" | "style" | "children"> & {
  placeholder?: string;
};

export function Trigger({ placeholder, ...props }: TriggerProps) {
  return (
    <Combobox.Trigger {...props} {...stylex.props(control.base, styles.trigger)}>
      <span {...stylex.props(styles.value)}>
        <Combobox.Value
          placeholder={<span {...stylex.props(styles.placeholder)}>{placeholder}</span>}
        />
      </span>
      <Icon icon={ChevronDown} />
    </Combobox.Trigger>
  );
}

export function Popup(props: Omit<Combobox.Popup.Props, "className" | "style">) {
  return (
    <Combobox.Portal>
      <Combobox.Positioner align="start" sideOffset={4}>
        <Combobox.Popup
          finalFocus={returnFocus}
          {...props}
          {...stylex.props(popup.root, styles.popup)}
        />
      </Combobox.Positioner>
    </Combobox.Portal>
  );
}

export function Search(props: Omit<Combobox.Input.Props, "className" | "style">) {
  return <Combobox.Input {...props} {...stylex.props(popup.search)} />;
}

export function List(props: Omit<Combobox.List.Props, "className" | "style">) {
  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        <Combobox.List {...props} {...stylex.props(popup.content, styles.list)} />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
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
  trigger: {
    justifyContent: "space-between",
    textAlign: "start",
  },
  value: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  placeholder: {
    color: text.subtle,
  },
  popup: {
    display: "flex",
    flexDirection: "column",
    minWidth: `max(${size.popup}, var(--anchor-width))`,
    maxHeight: `min(var(--available-height), calc(10 * ${size.md}))`,
    overflow: "hidden",
  },
  list: {
    display: { default: "flex", ":empty": "none" },
  },
  empty: {
    height: size.md,
    margin: space[1.5],
    color: text.subtle,
    display: { default: "flex", ":empty": "none" },
  },
});
