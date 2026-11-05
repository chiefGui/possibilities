import * as stylex from "@stylexjs/stylex";

import { background, border, surface, text } from "@/theme/colors.stylex";
import { font, fontSize, radius, shadow, size, space } from "@/theme/tokens.stylex";

export const popup = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    minWidth: size.popup,
    padding: space[1.5],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    borderRadius: radius.lg,
    backgroundColor: surface.raised,
    boxShadow: shadow.overlay,
    fontFamily: font.sans,
    outlineStyle: "none",
    WebkitAppRegion: "no-drag",
  },
  item: {
    flexShrink: 0,
    height: size.md,
    backgroundColor: { default: "transparent", ":is([data-highlighted])": background.hovered },
  },
  indicator: {
    marginInlineStart: "auto",
  },
  separator: {
    flexShrink: 0,
    height: 1,
    marginBlock: space[1.5],
    marginInline: `calc(-1 * ${space[1.5]})`,
    backgroundColor: border.default,
  },
  search: {
    flexShrink: 0,
    height: size.lg,
    marginTop: `calc(-1 * ${space[1.5]})`,
    marginInline: `calc(-1 * ${space[1.5]})`,
    marginBottom: space[1.5],
    paddingInline: `calc(${space[1.5]} + ${space[2]})`,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    backgroundColor: "transparent",
    color: text.default,
    fontFamily: "inherit",
    fontSize: fontSize.md,
    outlineStyle: "none",
    "::placeholder": { color: text.subtle },
  },
});
