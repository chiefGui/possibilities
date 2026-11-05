import * as stylex from "@stylexjs/stylex";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { icon } from "@/theme/colors.stylex";
import { size } from "@/theme/tokens.stylex";

export function Icon({ icon, xstyle }: { icon: IconSvgElement; xstyle?: stylex.StyleXStyles }) {
  return <HugeiconsIcon icon={icon} aria-hidden {...stylex.props(styles.icon, xstyle)} />;
}

const styles = stylex.create({
  icon: {
    flexShrink: 0,
    width: size.icon,
    height: size.icon,
    color: icon.subtle,
  },
});
