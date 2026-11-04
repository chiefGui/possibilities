import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";

import { background, border, text } from "@/theme/colors.stylex";
import { fontSize, opacity, radius, ring, size, space, weight } from "@/theme/tokens.stylex";

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
    fontSize: fontSize.md,
    fontWeight: weight.medium,
    whiteSpace: "nowrap",
    userSelect: "none",
    opacity: { default: null, ":disabled": opacity.disabled },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: ring.width,
    outlineColor: border.focused,
    outlineOffset: ring.offset,
  },
});

const variants = stylex.create({
  primary: {
    backgroundColor: { default: background.brand, ":hover": background.brandHovered },
    color: text.inverse,
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover": background.hovered },
    color: text.default,
  },
});
