import * as stylex from "@stylexjs/stylex";

import { border, surface, text } from "@/theme/colors.stylex";
import { fontSize, radius, size, space } from "@/theme/tokens.stylex";

export const control = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    gap: space[2],
    width: "100%",
    minWidth: 0,
    height: size.md,
    paddingInline: space[3],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: border.default,
      ":focus-within:not(:has([data-invalid]))": border.focused,
      ":has([data-invalid])": border.danger,
    },
    borderRadius: radius.md,
    backgroundColor: surface.default,
    color: text.default,
    fontFamily: "inherit",
    fontSize: fontSize.md,
    outlineStyle: "none",
  },
});
