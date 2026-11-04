import { Input as BaseInput } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, dimensions, fontSizes, radii, space } from "@/theme/tokens.stylex";

type InputProps = Omit<BaseInput.Props, "className" | "style"> & {
  start?: ReactNode;
  end?: ReactNode;
  xstyle?: stylex.StyleXStyles;
};

export function Input({ start, end, xstyle, ...props }: InputProps) {
  if (!start && !end) {
    return <BaseInput {...props} {...stylex.props(styles.box, styles.input, xstyle)} />;
  }
  return (
    <div {...stylex.props(styles.box, xstyle)}>
      {start && <span {...stylex.props(styles.adornment)}>{start}</span>}
      <BaseInput {...props} {...stylex.props(styles.input, styles.bare)} />
      {end && <span {...stylex.props(styles.adornment, styles.end)}>{end}</span>}
    </div>
  );
}

const styles = stylex.create({
  box: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: dimensions.md,
    paddingInline: space.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: colors.border,
      ":focus-within:not([data-invalid], :has([data-invalid]))": colors.ring,
      ":is([data-invalid], :has([data-invalid]))": colors.danger,
    },
    borderRadius: radii.md,
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: "inherit",
    fontSize: fontSizes.md,
  },
  input: {
    outlineStyle: "none",
    "::placeholder": { color: colors.mutedForeground },
  },
  bare: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
  },
  adornment: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    color: colors.mutedForeground,
  },
  end: {
    paddingInlineStart: space.sm,
  },
});
