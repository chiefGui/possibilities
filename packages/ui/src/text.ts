import { css } from "../styled-system/css";

export const text = {
  truncate: css.raw({
    minWidth: "0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  label: css.raw({
    fontSize: "sm",
    fontWeight: "medium",
    color: "text.subtle",
  }),
};
