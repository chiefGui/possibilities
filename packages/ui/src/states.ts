import * as stylex from "@stylexjs/stylex";

import { background, border } from "./theme/colors.stylex";
import { ring } from "./theme/tokens.stylex";

export const states = stylex.create({
  hover: {
    backgroundColor: { default: "transparent", ":hover": background.hovered },
  },
  ring: {
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: ring.width,
    outlineColor: border.focused,
    outlineOffset: ring.offset,
  },
});
