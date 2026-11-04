import { Field } from "@base-ui/react/field";
import * as stylex from "@stylexjs/stylex";

import { fg, status } from "@/theme/colors.stylex";
import { space, text, weight } from "@/theme/tokens.stylex";

export function Root(props: Omit<Field.Root.Props, "className" | "style">) {
  return <Field.Root {...props} {...stylex.props(styles.root)} />;
}

export function Label(props: Omit<Field.Label.Props, "className" | "style">) {
  return <Field.Label {...props} {...stylex.props(styles.label)} />;
}

export function Error(props: Omit<Field.Error.Props, "className" | "style">) {
  return <Field.Error {...props} {...stylex.props(styles.error)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space[2],
  },
  label: {
    fontSize: text.sm,
    fontWeight: weight.medium,
    color: fg.muted,
  },
  error: {
    margin: 0,
    fontSize: text.sm,
    color: status.danger,
  },
});
