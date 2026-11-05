import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";

import { space } from "@/theme/tokens.stylex";
import type { Unstyled } from "@/ui/props";
import { text } from "@/ui/text";

export function Root(props: Unstyled<Field.Root.Props>) {
  return <Field.Root {...props} {...stylex.props(styles.root)} />;
}

export function Label(props: Unstyled<Field.Label.Props>) {
  return <Field.Label {...props} {...stylex.props(text.label)} />;
}

export function Group(props: Unstyled<Fieldset.Root.Props>) {
  return <Fieldset.Root {...props} {...stylex.props(styles.root, styles.group)} />;
}

export function Legend(props: Unstyled<Fieldset.Legend.Props>) {
  return <Fieldset.Legend {...props} {...stylex.props(text.label)} />;
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
});
