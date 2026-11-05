import { Form as BaseForm } from "@base-ui/react/form";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { text } from "@/theme/colors.stylex";
import { fontSize, space } from "@/theme/tokens.stylex";
import type { Unstyled } from "@/ui/props";

export function Root(props: Unstyled<BaseForm.Props>) {
  return <BaseForm {...props} {...stylex.props(styles.root)} />;
}

export function Error(props: Unstyled<ComponentProps<"p">>) {
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
    fontSize: fontSize.sm,
    color: text.danger,
  },
});
