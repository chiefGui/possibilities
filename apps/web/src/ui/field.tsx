import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";

import { text } from "@/theme/colors.stylex";
import { fontSize, space, weight } from "@/theme/tokens.stylex";

export function Root(props: Omit<Field.Root.Props, "className" | "style">) {
  return <Field.Root {...props} {...stylex.props(styles.root)} />;
}

export function Label(props: Omit<Field.Label.Props, "className" | "style">) {
  return <Field.Label {...props} {...stylex.props(styles.label)} />;
}

export function Group(props: Omit<Fieldset.Root.Props, "className" | "style">) {
  return <Fieldset.Root {...props} {...stylex.props(styles.root, styles.group)} />;
}

export function Legend(props: Omit<Fieldset.Legend.Props, "className" | "style">) {
  return <Fieldset.Legend {...props} {...stylex.props(styles.label)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space[2],
  },
  group: {
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: weight.medium,
    color: text.subtle,
  },
});
