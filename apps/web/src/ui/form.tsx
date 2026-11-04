import { Form as BaseForm } from "@base-ui/react/form";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { status } from "@/theme/colors.stylex";
import { space, text } from "@/theme/tokens.stylex";

export function Root(props: Omit<BaseForm.Props, "className" | "style">) {
  return <BaseForm {...props} {...stylex.props(styles.root)} />;
}

export function Error(props: Omit<ComponentProps<"p">, "className" | "style">) {
  return <p role="alert" {...props} {...stylex.props(styles.error)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space[6],
  },
  error: {
    margin: 0,
    fontSize: text.sm,
    color: status.danger,
  },
});
