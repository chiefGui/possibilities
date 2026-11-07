import { css } from "../styled-system/css";

export const sideOffset = 4;

export const returnFocus = (closeType: string) => closeType === "keyboard";

export const popup = {
  root: css.raw({
    display: "flex",
    flexDirection: "column",
    minWidth: "popup",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.default",
    borderRadius: "lg",
    backgroundColor: "surface.raised",
    boxShadow: "overlay",
    color: "text.default",
    fontFamily: "sans",
    fontSize: "md",
    outlineStyle: "none",
    appRegion: "no-drag",
    transformOrigin: "var(--transform-origin)",
    _transitioning: { opacity: 0, transform: "scale(0.96)" },
    transitionProperty: "opacity, transform",
    transitionDuration: "fast",
    transitionTimingFunction: "standard",
  }),
  content: css.raw({
    display: "flex",
    flexDirection: "column",
    padding: "1.5",
  }),
  item: css.raw({
    flexShrink: 0,
    height: "md",
    backgroundColor: { base: "transparent", _highlighted: "background.hovered" },
  }),
  indicator: css.raw({
    marginInlineStart: "auto",
  }),
  separator: css.raw({
    flexShrink: 0,
    height: "1px",
    marginBlock: "1.5",
    marginInline: "-1.5",
    backgroundColor: "border.default",
  }),
  search: css.raw({
    flexShrink: 0,
    height: "lg",
    paddingInline: "calc({spacing.1.5} + {spacing.2})",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "border.default",
  }),
};
