import { cn } from "cn";
import { createTV } from "tailwind-variants/lite";

export { cn };
export type { VariantProps } from "tailwind-variants/lite";

export const tv = createTV({ twMerge: cn });
