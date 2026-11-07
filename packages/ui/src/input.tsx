import { Input } from "@base-ui/react/input";
import type { ComponentProps } from "react";

import { css } from "../styled-system/css";
import { control } from "./control";
import type { Unstyled } from "./props";

export function Root(props: Unstyled<ComponentProps<"div">>) {
  return <div {...props} className={css(control.base)} />;
}

export function Control(props: Unstyled<Input.Props>) {
  return <Input {...props} className={css(control.input, styles.control)} />;
}

export function Addon(props: Unstyled<ComponentProps<"span">>) {
  return <span {...props} className={styles.addon} />;
}

const styles = {
  control: css.raw({
    flex: 1,
    height: "100%",
  }),
  addon: css({
    flexShrink: 0,
    whiteSpace: "nowrap",
    color: "text.subtle",
  }),
};
