import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";

import { accent, bg, border, fg } from "@/theme/colors.stylex";
import { radius, size, space, text, weight } from "@/theme/tokens.stylex";

type ButtonProps = Omit<BaseButton.Props, "className" | "style"> & {
  variant?: keyof typeof variants;
  xstyle?: stylex.StyleXStyles;
};

export function Button({ variant = "primary", xstyle, ...props }: ButtonProps) {
  return <BaseButton {...props} {...stylex.props(styles.base, variants[variant], xstyle)} />;
}

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space[2],
    flexShrink: 0,
    height: size.md,
    paddingInline: space[3],
    borderWidth: 0,
    borderRadius: radius.md,
    fontFamily: "inherit",
    fontSize: text.md,
    fontWeight: weight.medium,
    whiteSpace: "nowrap",
    userSelect: "none",
    opacity: { default: 1, ":disabled": 0.5 },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 3,
    outlineColor: border.focus,
    outlineOffset: 1,
  },
});

const variants = stylex.create({
  primary: {
    backgroundColor: { default: accent.solid, ":hover": accent.solidHover },
    color: fg.onAccent,
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover": bg.hover },
    color: fg.default,
  },
});
