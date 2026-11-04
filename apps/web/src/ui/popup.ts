import * as stylex from "@stylexjs/stylex";

import { background, border, surface } from "@/theme/colors.stylex";
import { font, radius, shadow, space } from "@/theme/tokens.stylex";

export const popup = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    minWidth: 220,
    padding: space[1],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    borderRadius: radius.md,
    backgroundColor: surface.raised,
    boxShadow: shadow.overlay,
    fontFamily: font.sans,
    outlineStyle: "none",
    WebkitAppRegion: "no-drag",
  },
  item: {
    flexShrink: 0,
    backgroundColor: { default: "transparent", ":is([data-highlighted])": background.hovered },
  },
  indicator: {
    marginInlineStart: "auto",
  },
});
