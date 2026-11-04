import { Input } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { bg, border, fg, status } from "@/theme/colors.stylex";
import { radius, size, space, text } from "@/theme/tokens.stylex";

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
    width: "100%",
    height: size.md,
    paddingInline: space[3],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: border.default,
      ":focus-within:not(:has([data-invalid]))": border.focus,
      ":has([data-invalid])": status.danger,
    },
    borderRadius: radius.md,
    backgroundColor: bg.canvas,
    color: fg.default,
    fontSize: text.md,
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
    "::placeholder": { color: fg.muted },
  },
  addon: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    color: fg.muted,
    marginInlineStart: { default: 0, ":is(input ~ *)": space[2] },
  },
});
