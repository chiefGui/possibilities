import { Tooltip } from "@base-ui/react/tooltip";

import { css } from "../styled-system/css";
import { popup, sideOffset } from "./popup";
import type { Unstyled } from "./props";

export const Root = Tooltip.Root;

export const Trigger = Tooltip.Trigger;

export function Popup(props: Unstyled<Tooltip.Popup.Props>) {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={sideOffset}>
        <Tooltip.Popup {...props} className={css(popup.root, tooltip)} />
      </Tooltip.Positioner>
    </Tooltip.Portal>
  );
}

const tooltip = css.raw({
  minWidth: "0",
  maxWidth: "column",
  paddingBlock: "1.5",
  paddingInline: "2",
  fontSize: "sm",
  whiteSpace: "pre-line",
  overflowWrap: "anywhere",
});
