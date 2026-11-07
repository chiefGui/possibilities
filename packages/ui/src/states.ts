import { css } from "../styled-system/css";

export const states = {
  hover: css.raw({
    backgroundColor: { base: "transparent", _hover: "background.hovered" },
  }),
  ring: css.raw({
    outlineStyle: { base: "none", _focusVisible: "solid" },
    outlineWidth: "3px",
    outlineColor: "border.focused",
    outlineOffset: "1px",
  }),
};
