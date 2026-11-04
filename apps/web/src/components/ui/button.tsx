import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";

import { accent, bg, border, fg } from "@/theme/colors.stylex";
import { motion, radius, space, text, weight } from "@/theme/tokens.stylex";

type ButtonProps = Omit<BaseButton.Props, "className" | "style"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  xstyle?: stylex.StyleXStyles;
};

export function Button({ variant = "primary", size = "md", xstyle, ...props }: ButtonProps) {
  return (
    <BaseButton {...props} {...stylex.props(styles.base, variants[variant], sizes[size], xstyle)} />
  );
}

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space[2],
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: radius.md,
    fontFamily: "inherit",
    fontSize: text.md,
    fontWeight: weight.medium,
    whiteSpace: "nowrap",
    userSelect: "none",
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 3,
    outlineColor: border.focus,
    outlineOffset: 1,
    transform: { default: null, ":active": "translateY(1px)" },
    transitionProperty: "background-color, border-color, transform",
    transitionDuration: motion.fast,
  },
});

const variants = stylex.create({
  primary: {
    backgroundColor: { default: accent.solid, ":hover": accent.solidHover },
    color: fg.onAccent,
  },
  outline: {
    backgroundColor: { default: bg.canvas, ":hover": bg.hover },
    borderColor: border.default,
    color: fg.default,
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover": bg.hover },
    color: fg.default,
  },
});

const sizes = stylex.create({
  sm: { height: 28, paddingInline: space[3], fontSize: text.sm, borderRadius: radius.sm },
  md: { height: 32, paddingInline: space[3] },
  lg: { height: 36, paddingInline: space[4] },
});
