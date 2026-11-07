import * as stylex from "@stylexjs/stylex";

import { text } from "./theme/colors.stylex";
import { fontSize, radius, size, space } from "./theme/tokens.stylex";

export const row = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    gap: space[2],
    minWidth: 0,
    height: size.sm,
    paddingInline: space[2],
    borderWidth: 0,
    borderRadius: radius.sm,
    fontFamily: "inherit",
    fontSize: fontSize.md,
    color: text.default,
    textDecoration: "none",
    userSelect: "none",
    outlineStyle: "none",
  },
});
