import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";

import { colors, fontSizes, radii, dimensions, space } from "@/theme/tokens.stylex";

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
    gap: space.sm,
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: radii.md,
    fontFamily: "inherit",
    fontSize: fontSizes.md,
    fontWeight: 500,
    whiteSpace: "nowrap",
    userSelect: "none",
    opacity: { default: 1, ":disabled": 0.5 },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 3,
    outlineColor: colors.ring,
    outlineOffset: 1,
    transform: { default: null, ":active": "translateY(1px)" },
  },
});

const variants = stylex.create({
  primary: {
    backgroundColor: { default: colors.primary, ":hover": colors.primaryHover },
    color: colors.primaryForeground,
  },
  outline: {
    backgroundColor: { default: colors.background, ":hover": colors.muted },
    borderColor: colors.border,
    color: colors.foreground,
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover": colors.muted },
    color: colors.foreground,
  },
});

const sizes = stylex.create({
  sm: {
    height: dimensions.sm,
    paddingInline: space.sm,
    fontSize: fontSizes.sm,
    borderRadius: radii.sm,
  },
  md: { height: dimensions.md, paddingInline: space.md },
  lg: { height: dimensions.lg, paddingInline: space.lg },
});
