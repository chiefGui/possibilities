import { Form as BaseForm } from "@base-ui/react/form";
import type { ComponentProps } from "react";

import { css } from "../styled-system/css";
import type { Unstyled } from "./props";

export function Root(props: Unstyled<BaseForm.Props>) {
  return <BaseForm {...props} className={styles.root} />;
}

export function Error(props: Unstyled<ComponentProps<"p">>) {
  return <p role="alert" {...props} className={styles.error} />;
}

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
  }),
  error: css({
    margin: 0,
    fontSize: "sm",
    color: "text.danger",
  }),
};
