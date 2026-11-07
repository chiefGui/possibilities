import * as stylex from "@stylexjs/stylex";

import { background, border, surface, text } from "@/theme/colors.stylex";
import { font, fontSize, motion, radius, shadow, size, space } from "@/theme/tokens.stylex";

export const sideOffset = 4;

export const returnFocus = (closeType: string) => closeType === "keyboard";

export const popup = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    minWidth: size.popup,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    borderRadius: radius.lg,
    backgroundColor: surface.raised,
    boxShadow: shadow.overlay,
    color: text.default,
    fontFamily: font.sans,
    fontSize: fontSize.md,
    outlineStyle: "none",
    WebkitAppRegion: "no-drag",
    transformOrigin: "var(--transform-origin)",
    opacity: { default: 1, ":is([data-starting-style], [data-ending-style])": 0 },
    transform: {
      default: "none",
      ":is([data-starting-style], [data-ending-style])": "scale(0.96)",
    },
    transitionProperty: "opacity, transform",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.easing,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: space[1.5],
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
    paddingInline: `calc(${space[1.5]} + ${space[2]})`,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: border.default,
  },
});
