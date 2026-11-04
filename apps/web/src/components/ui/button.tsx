import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";

import { colors, dimensions, fontSizes, radii, space } from "@/theme/tokens.stylex";

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
    gap: space.sm,
    flexShrink: 0,
    height: dimensions.md,
    paddingInline: space.md,
    borderWidth: 0,
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
  ghost: {
    backgroundColor: { default: "transparent", ":hover": colors.muted },
    color: colors.foreground,
  },
});
