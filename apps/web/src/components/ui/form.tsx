import { Field as BaseField } from "@base-ui/react/field";
import { Form as BaseForm } from "@base-ui/react/form";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { fg, status } from "@/theme/colors.stylex";
import { space, text, weight } from "@/theme/tokens.stylex";

type FormProps = Omit<BaseForm.Props, "className" | "style">;

export function Form(props: FormProps) {
  return <BaseForm {...props} {...stylex.props(styles.form)} />;
}

type FieldProps = Omit<BaseField.Root.Props, "className" | "style" | "render"> & {
  label: string;
  children: ReactNode;
};

export function Field({ label, children, ...props }: FieldProps) {
  return (
    <BaseField.Root {...props} {...stylex.props(styles.field)}>
      <BaseField.Label {...stylex.props(styles.label)}>{label}</BaseField.Label>
      {children}
      <BaseField.Error {...stylex.props(styles.message)} />
    </BaseField.Root>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" {...stylex.props(styles.message)}>
      {children}
    </p>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.actions)}>{children}</div>;
}

const styles = stylex.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: space[6],
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: space[2],
  },
  label: {
    fontSize: text.sm,
    fontWeight: weight.medium,
    color: fg.muted,
  },
  message: {
    margin: 0,
    fontSize: text.sm,
    color: status.danger,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: space[2],
  },
});
