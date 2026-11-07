import { ContextMenu } from "@base-ui/react/context-menu";

import { css } from "../styled-system/css";
import { popup, returnFocus } from "./popup";
import type { Unstyled } from "./props";

export const Root = ContextMenu.Root;

export const Trigger = ContextMenu.Trigger;

export function Popup(props: Unstyled<ContextMenu.Popup.Props>) {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Positioner>
        <ContextMenu.Popup
          finalFocus={returnFocus}
          {...props}
          className={css(popup.root, popup.content)}
        />
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  );
}
