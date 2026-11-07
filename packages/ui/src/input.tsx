import { Input } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { text } from "./theme/colors.stylex";
import { control } from "./control";
import type { Unstyled } from "./props";

export function Root(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} {...stylex.props(control.base)} />;
}

export function Control(props: Unstyled<Input.Props>) {
  return <Input {...props} {...stylex.props(control.input, styles.control)} />;
}

export function Addon(props: Unstyled<ComponentProps<"span">>) {
  return <span {...props} {...stylex.props(styles.addon)} />;
}

const styles = stylex.create({
  control: {
    flex: 1,
    height: "100%",
  },
  addon: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    color: text.subtle,
  },
});
