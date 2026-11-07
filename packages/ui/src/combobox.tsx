import { Combobox } from "@base-ui/react/combobox";

import { css } from "../styled-system/css";
import { control } from "./control";
import { Icon } from "./icon";
import { popup, returnFocus, sideOffset } from "./popup";
import type { Unstyled } from "./props";
import { row } from "./row";
import * as ScrollArea from "./scroll-area";
import { text } from "./text";

export const Root: typeof Combobox.Root = (props) => <Combobox.Root autoHighlight {...props} />;

type TriggerProps = Omit<Unstyled<Combobox.Trigger.Props>, "children"> & {
  placeholder?: string;
};

export function Trigger({ placeholder, ...props }: TriggerProps) {
  return (
    <Combobox.Trigger {...props} className={css(control.base, styles.trigger)}>
      <span className={css(text.truncate)}>
        <Combobox.Value placeholder={<span className={styles.placeholder}>{placeholder}</span>} />
      </span>
      <Icon name="dropdown" />
    </Combobox.Trigger>
  );
}

export function Popup(props: Unstyled<Combobox.Popup.Props>) {
  return (
    <Combobox.Portal>
      <Combobox.Positioner align="start" sideOffset={sideOffset}>
        <Combobox.Popup
          finalFocus={returnFocus}
          {...props}
          className={css(popup.root, styles.popup)}
        />
      </Combobox.Positioner>
    </Combobox.Portal>
  );
}

export function Search(props: Unstyled<Combobox.Input.Props>) {
  return <Combobox.Input {...props} className={css(control.input, popup.search)} />;
}

export function List(props: Unstyled<Combobox.List.Props>) {
  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        <Combobox.List {...props} className={css(popup.content, styles.collapsible)} />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}

export function Item({ children, ...props }: Unstyled<Combobox.Item.Props>) {
  return (
    <Combobox.Item {...props} className={css(row, popup.item)}>
      {children}
      <Combobox.ItemIndicator render={<Icon name="selected" className={css(popup.indicator)} />} />
    </Combobox.Item>
  );
}

export function Empty(props: Unstyled<Combobox.Empty.Props>) {
  return (
    <Combobox.Empty {...props} className={css(row, popup.item, styles.empty, styles.collapsible)} />
  );
}

const styles = {
  trigger: css.raw({
    justifyContent: "space-between",
    textAlign: "start",
  }),
  placeholder: css({
    color: "text.subtle",
  }),
  popup: css.raw({
    minWidth: "max({sizes.popup}, var(--anchor-width))",
    maxHeight: "min(var(--available-height), calc(10 * {sizes.md}))",
    overflow: "hidden",
  }),
  empty: css.raw({
    margin: "1.5",
    color: "text.subtle",
  }),
  collapsible: css.raw({
    display: "flex",
    "&:empty": { display: "none" },
  }),
};
