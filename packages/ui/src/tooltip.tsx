import { Tooltip } from "@base-ui/react/tooltip";
import * as stylex from "@stylexjs/stylex";

import { fontSize, size, space } from "./theme/tokens.stylex";
import { popup, sideOffset } from "./popup";
import type { Unstyled } from "./props";

export const Root = Tooltip.Root;

export const Trigger = Tooltip.Trigger;

export function Popup(props: Unstyled<Tooltip.Popup.Props>) {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={sideOffset}>
        <Tooltip.Popup {...props} {...stylex.props(popup.root, styles.popup)} />
      </Tooltip.Positioner>
    </Tooltip.Portal>
  );
}

const styles = stylex.create({
  popup: {
    minWidth: 0,
    maxWidth: size.column,
    paddingBlock: space[1.5],
    paddingInline: space[2],
    fontSize: fontSize.sm,
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
  },
});
