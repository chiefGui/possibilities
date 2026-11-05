import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  CircleDashedIcon,
  Home01Icon,
  PackageIcon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import { icon } from "@/theme/colors.stylex";
import { size } from "@/theme/tokens.stylex";

const glyphs = {
  add: Add01Icon,
  home: Home01Icon,
  project: PackageIcon,
  selected: Tick01Icon,
  success: CheckmarkCircle01Icon,
  pending: CircleDashedIcon,
  dropdown: ArrowDown01Icon,
  expand: ArrowRight01Icon,
};

type IconName = keyof typeof glyphs;

export function Icon({ name, xstyle }: { name: IconName; xstyle?: stylex.StyleXStyles }) {
  return <HugeiconsIcon icon={glyphs[name]} aria-hidden {...stylex.props(styles.icon, xstyle)} />;
}

const styles = stylex.create({
  icon: {
    flexShrink: 0,
    width: size.icon,
    height: size.icon,
    color: icon.subtle,
  },
});
