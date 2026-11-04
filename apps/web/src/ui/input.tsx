import { Input } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { border, surface, text } from "@/theme/colors.stylex";
import { fontSize, radius, size, space } from "@/theme/tokens.stylex";

type RootProps = Omit<ComponentProps<"div">, "className" | "style"> & {
  xstyle?: stylex.StyleXStyles;
};

export function Root({ xstyle, ...props }: RootProps) {
  return <div {...props} {...stylex.props(styles.root, xstyle)} />;
}

export function Control(props: Omit<Input.Props, "className" | "style">) {
  return <Input {...props} {...stylex.props(styles.control)} />;
}

export function Addon(props: Omit<ComponentProps<"span">, "className" | "style">) {
  return <span {...props} {...stylex.props(styles.addon)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: space[2],
    width: "100%",
    height: size.md,
    paddingInline: space[3],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: border.default,
      ":focus-within:not(:has([data-invalid]))": border.focused,
      ":has([data-invalid])": border.danger,
    },
    borderRadius: radius.md,
    backgroundColor: surface.default,
    color: text.default,
    fontSize: fontSize.md,
  },
  control: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    padding: 0,
    borderWidth: 0,
    outlineStyle: "none",
    backgroundColor: "transparent",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    "::placeholder": { color: text.subtle },
  },
  addon: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    color: text.subtle,
  },
});
