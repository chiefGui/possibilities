import { Select } from "@base-ui/react/select";
import * as stylex from "@stylexjs/stylex";
import { Check, ChevronDown } from "lucide-react";

import { background } from "@/theme/colors.stylex";
import { size, space } from "@/theme/tokens.stylex";
import { Icon } from "@/ui/icon";
import { popup } from "@/ui/popup";
import { row } from "@/ui/row";

export const Root = Select.Root;

export function Trigger(props: Omit<Select.Trigger.Props, "className" | "style" | "children">) {
  return (
    <Select.Trigger {...props} {...stylex.props(row.base, styles.trigger)}>
      <Select.Value />
      <Icon icon={ChevronDown} />
    </Select.Trigger>
  );
}

export function Popup(props: Omit<Select.Popup.Props, "className" | "style">) {
  return (
    <Select.Portal>
      <Select.Positioner align="start" sideOffset={4} alignItemWithTrigger={false}>
        <Select.Popup {...props} {...stylex.props(popup.root, styles.popup)} />
      </Select.Positioner>
    </Select.Portal>
  );
}

export function Item({ children, ...props }: Omit<Select.Item.Props, "className" | "style">) {
  return (
    <Select.Item {...props} {...stylex.props(row.base, popup.item)}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator render={<Icon icon={Check} xstyle={popup.indicator} />} />
    </Select.Item>
  );
}

const styles = stylex.create({
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
    maxHeight: "var(--available-height)",
    overflowY: "auto",
  },
});
