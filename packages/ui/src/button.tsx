import { Button as BaseButton } from "@base-ui/react/button";

import { cva, type RecipeVariantProps } from "../styled-system/css";
import type { Unstyled } from "./props";
import { states } from "./states";

type ButtonProps = Unstyled<BaseButton.Props> & RecipeVariantProps<typeof button>;

export function Button({ variant, ...props }: ButtonProps) {
  return <BaseButton {...props} className={button({ variant })} />;
}

const button = cva({
  base: {
    ...states.ring,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2",
    flexShrink: 0,
    height: "md",
    paddingInline: "3",
    borderWidth: 0,
    borderRadius: "md",
    fontFamily: "inherit",
    fontSize: "md",
    fontWeight: "medium",
    whiteSpace: "nowrap",
    userSelect: "none",
    _disabled: { opacity: "disabled" },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: { base: "background.brand", _hover: "background.brandHovered" },
        color: "text.inverse",
      },
      danger: {
        backgroundColor: { base: "background.danger", _hover: "background.dangerHovered" },
        color: "text.inverse",
      },
      ghost: {
        ...states.hover,
        color: "text.default",
      },
    },
  },
  defaultVariants: { variant: "primary" },
});
