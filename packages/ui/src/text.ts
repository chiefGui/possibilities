import * as stylex from "@stylexjs/stylex";

import { text as color } from "./theme/colors.stylex";
import { fontSize, weight } from "./theme/tokens.stylex";

export const text = stylex.create({
  truncate: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: weight.medium,
    color: color.subtle,
  },
});
