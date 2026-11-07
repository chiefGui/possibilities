import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";

import { css } from "../styled-system/css";
import type { Unstyled } from "./props";
import { text } from "./text";

export function Root(props: Unstyled<Field.Root.Props>) {
  return <Field.Root {...props} className={css(styles.root)} />;
}

export function Label(props: Unstyled<Field.Label.Props>) {
  return <Field.Label {...props} className={css(text.label)} />;
}

export function Group(props: Unstyled<Fieldset.Root.Props>) {
  return <Fieldset.Root {...props} className={css(styles.root, styles.group)} />;
}

export function Legend(props: Unstyled<Fieldset.Legend.Props>) {
  return <Fieldset.Legend {...props} className={css(text.label)} />;
}

const styles = {
  root: css.raw({
    display: "flex",
    flexDirection: "column",
    gap: "2",
  }),
  group: css.raw({
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  }),
};
