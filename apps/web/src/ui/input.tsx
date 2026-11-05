import { Input } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { text } from "@/theme/colors.stylex";
import { control } from "@/ui/control";

export function Root(props: Omit<ComponentProps<"div">, "className" | "style">) {
  return <div {...props} {...stylex.props(control.base)} />;
}

export function Control(props: Omit<Input.Props, "className" | "style">) {
  return <Input {...props} {...stylex.props(styles.control)} />;
}

export function Addon(props: Omit<ComponentProps<"span">, "className" | "style">) {
  return <span {...props} {...stylex.props(styles.addon)} />;
}

const styles = stylex.create({
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
