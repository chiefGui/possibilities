import { css } from "../styled-system/css";

export const row = css.raw({
  display: "flex",
  alignItems: "center",
  gap: "2",
  minWidth: "0",
  height: "sm",
  paddingInline: "2",
  borderWidth: 0,
  borderRadius: "sm",
  fontFamily: "inherit",
  fontSize: "md",
  color: "text.default",
  textDecoration: "none",
  userSelect: "none",
  outlineStyle: "none",
});
