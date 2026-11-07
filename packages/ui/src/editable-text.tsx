import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { background } from "./theme/colors.stylex";
import { radius, size, space } from "./theme/tokens.stylex";
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
      {...stylex.props(control.input, styles.input)}
    />
  );
}

const styles = stylex.create({
  input: {
    fieldSizing: "content",
    height: size.sm,
    marginInline: `calc(-1 * ${space[2]})`,
    paddingInline: space[2],
    borderRadius: radius.sm,
    backgroundColor: {
      default: "transparent",
      ":hover": background.hovered,
      ":focus": background.hovered,
    },
  },
});
