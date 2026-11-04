import * as stylex from "@stylexjs/stylex";
import { CircleCheck, CircleDashed } from "lucide-react";

import { icon } from "@/theme/colors.stylex";
import { Icon } from "@/ui/icon";

export function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? <Icon icon={CircleCheck} xstyle={styles.ok} /> : <Icon icon={CircleDashed} />;
}

const styles = stylex.create({
  ok: { color: icon.success },
});
