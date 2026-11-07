import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  CircleDashedIcon,
  CloudAlertIcon,
  Home01Icon,
  PackageIcon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { cx } from "../styled-system/css";
import { icon } from "../styled-system/recipes";

const glyphs = {
  add: Add01Icon,
  home: Home01Icon,
  project: PackageIcon,
  selected: Tick01Icon,
  success: CheckmarkCircle01Icon,
  pending: CircleDashedIcon,
  failed: CloudAlertIcon,
  dropdown: ArrowDown01Icon,
  expand: ArrowRight01Icon,
};

type IconName = keyof typeof glyphs;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return <HugeiconsIcon icon={glyphs[name]} aria-hidden className={cx(icon(), className)} />;
}
