import { css } from "../styled-system/css";

export const control = {
  base: css.raw({
    display: "flex",
    alignItems: "center",
    gap: "2",
    width: "full",
    minWidth: "0",
    height: "md",
    paddingInline: "3",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.default",
    borderRadius: "md",
    backgroundColor: "surface.default",
    color: "text.default",
    fontFamily: "inherit",
    fontSize: "md",
    outlineStyle: "none",
    "&:is(:hover, :has(:hover)):not(:focus-within, [data-popup-open], :has([data-invalid]))": {
      borderColor: "border.hovered",
    },
    "&:is(:focus-within, [data-popup-open]):not(:has([data-invalid]))": {
      borderColor: "border.focused",
    },
    "&:has([data-invalid])": { borderColor: "border.danger" },
  }),
  input: css.raw({
    minWidth: "0",
    padding: "0",
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    outlineStyle: "none",
    "&::placeholder": { color: "text.subtle" },
  }),
};
