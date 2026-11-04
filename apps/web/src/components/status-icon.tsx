import * as stylex from "@stylexjs/stylex";
import { CircleCheck, CircleDashed } from "lucide-react";
import { fg, status } from "@/theme/colors.stylex";
import { size } from "@/theme/tokens.stylex";

export function StatusIcon({ ok }: { ok: boolean }) {
  const Icon = ok ? CircleCheck : CircleDashed;
  return <Icon aria-hidden {...stylex.props(styles.icon, ok ? styles.ok : styles.pending)} />;
}

const styles = stylex.create({
  icon: {
    flexShrink: 0,
    width: size.icon,
    height: size.icon,
  },
  ok: { color: status.success },
  pending: { color: fg.muted },
});
