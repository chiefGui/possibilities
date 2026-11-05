import { Combobox } from "@base-ui/react/combobox";
import * as stylex from "@stylexjs/stylex";
import { ArrowDown01Icon, Tick01Icon } from "@hugeicons-pro/core-stroke-rounded";

import { text as color } from "@/theme/colors.stylex";
import { size, space } from "@/theme/tokens.stylex";
import { control } from "@/ui/control";
import { Icon } from "@/ui/icon";
import { popup, returnFocus } from "@/ui/popup";
import type { Unstyled } from "@/ui/props";
import { row } from "@/ui/row";
import * as ScrollArea from "@/ui/scroll-area";
import { text } from "@/ui/text";

export const Root: typeof Combobox.Root = (props) => <Combobox.Root autoHighlight {...props} />;

type TriggerProps = Omit<Unstyled<Combobox.Trigger.Props>, "children"> & {
  placeholder?: string;
};

export function Trigger({ placeholder, ...props }: TriggerProps) {
  return (
    <Combobox.Trigger {...props} {...stylex.props(control.base, styles.trigger)}>
      <span {...stylex.props(text.truncate)}>
        <Combobox.Value
          placeholder={<span {...stylex.props(styles.placeholder)}>{placeholder}</span>}
        />
      </span>
      <Icon icon={ArrowDown01Icon} />
    </Combobox.Trigger>
  );
}

export function Popup(props: Unstyled<Combobox.Popup.Props>) {
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

export function Search(props: Unstyled<Combobox.Input.Props>) {
  return <Combobox.Input {...props} {...stylex.props(control.input, popup.search)} />;
}

export function List(props: Unstyled<Combobox.List.Props>) {
  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        <Combobox.List {...props} {...stylex.props(popup.content, styles.collapsible)} />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}

export function Item({ children, ...props }: Unstyled<Combobox.Item.Props>) {
  return (
    <Combobox.Item {...props} {...stylex.props(row.base, popup.item)}>
      {children}
      <Combobox.ItemIndicator render={<Icon icon={Tick01Icon} xstyle={popup.indicator} />} />
    </Combobox.Item>
  );
}

export function Empty(props: Unstyled<Combobox.Empty.Props>) {
  return (
    <Combobox.Empty
      {...props}
      {...stylex.props(row.base, popup.item, styles.empty, styles.collapsible)}
    />
  );
}

const styles = stylex.create({
  trigger: {
    justifyContent: "space-between",
    textAlign: "start",
  },
  placeholder: {
    color: color.subtle,
  },
  popup: {
    minWidth: `max(${size.popup}, var(--anchor-width))`,
    maxHeight: `min(var(--available-height), calc(10 * ${size.md}))`,
    overflow: "hidden",
  },
  empty: {
    margin: space[1.5],
    color: color.subtle,
  },
  collapsible: {
    display: { default: "flex", ":empty": "none" },
  },
});
