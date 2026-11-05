import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";

import { background, text } from "@/theme/colors.stylex";
import { fontSize, opacity, radius, size, space, weight } from "@/theme/tokens.stylex";
import type { Unstyled } from "@/ui/props";
import { states } from "@/ui/states";

type ButtonProps = Unstyled<BaseButton.Props> & { variant?: keyof typeof variants };

export function Button({ variant = "primary", ...props }: ButtonProps) {
  return <BaseButton {...props} {...stylex.props(styles.base, states.ring, variants[variant])} />;
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
  },
});

const tones = stylex.create({
  primary: {
    backgroundColor: { default: background.brand, ":hover": background.brandHovered },
    color: text.inverse,
  },
  ghost: {
    color: text.default,
  },
});

const variants = {
  primary: tones.primary,
  ghost: [states.hover, tones.ghost],
};
