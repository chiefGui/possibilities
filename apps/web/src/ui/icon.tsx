import * as stylex from "@stylexjs/stylex";
import type { LucideIcon } from "lucide-react";

import { icon } from "@/theme/colors.stylex";
import { size } from "@/theme/tokens.stylex";

export function Icon({ icon: Glyph, xstyle }: { icon: LucideIcon; xstyle?: stylex.StyleXStyles }) {
  return <Glyph aria-hidden {...stylex.props(styles.icon, xstyle)} />;
}

const styles = stylex.create({
  icon: {
    flexShrink: 0,
    width: size.icon,
    height: size.icon,
    color: icon.subtle,
  },
});
