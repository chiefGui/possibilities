import type { ComponentProps } from "react";

import { css } from "../styled-system/css";
import { control } from "./control";
import type { Unstyled } from "./props";

type EditableTextProps = Omit<
  Unstyled<ComponentProps<"input">>,
  "value" | "defaultValue" | "onBlur" | "onKeyDown"
> & {
  defaultValue: string;
  onCommit: (value: string) => void;
};

export function EditableText({ defaultValue, onCommit, ...props }: EditableTextProps) {
  return (
    <input
      {...props}
      defaultValue={defaultValue}
      onKeyDown={(event) => {
        if (event.key === "Escape") event.currentTarget.value = defaultValue;
        if (event.key === "Enter" || event.key === "Escape") event.currentTarget.blur();
      }}
      onBlur={(event) => {
        const value = event.currentTarget.value.trim();
        if (!value) event.currentTarget.value = defaultValue;
        else if (value !== defaultValue) onCommit(value);
      }}
      className={css(control.input, input)}
    />
  );
}

const input = css.raw({
  fieldSizing: "content",
  height: "sm",
  marginInline: "-2",
  paddingInline: "2",
  borderRadius: "sm",
  backgroundColor: {
    base: "transparent",
    _hover: "background.hovered",
    _focus: "background.hovered",
  },
});
