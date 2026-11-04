import { Input as BaseInput } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { bg, border, fg, status } from "@/theme/colors.stylex";
import { radius, size, space, text } from "@/theme/tokens.stylex";

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
    height: size.md,
    paddingInline: space[3],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: border.default,
      ":focus-within:not([data-invalid], :has([data-invalid]))": border.focus,
      ":is([data-invalid], :has([data-invalid]))": status.danger,
    },
    borderRadius: radius.md,
    backgroundColor: bg.canvas,
    color: fg.default,
    fontFamily: "inherit",
    fontSize: text.md,
  },
  input: {
    outlineStyle: "none",
    "::placeholder": { color: fg.muted },
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
    color: fg.muted,
  },
  end: {
    paddingInlineStart: space[2],
  },
});
