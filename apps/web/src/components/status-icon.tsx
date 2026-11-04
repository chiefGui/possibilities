import * as stylex from "@stylexjs/stylex";
import { CircleCheck, CircleDashed } from "lucide-react";

import { colors, dimensions } from "@/theme/tokens.stylex";

export function StatusIcon({ ok }: { ok: boolean }) {
  const Icon = ok ? CircleCheck : CircleDashed;
  return <Icon aria-hidden {...stylex.props(styles.icon, ok ? styles.ok : styles.pending)} />;
}

const styles = stylex.create({
  icon: {
    flexShrink: 0,
    width: dimensions.icon,
    height: dimensions.icon,
  },
  ok: { color: colors.success },
  pending: { color: colors.mutedForeground },
});
