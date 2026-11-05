import * as stylex from "@stylexjs/stylex";

import { icon } from "@/theme/colors.stylex";
import { Icon } from "@/ui/icon";

export function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? <Icon name="success" xstyle={styles.ok} /> : <Icon name="pending" />;
}

const styles = stylex.create({
  ok: { color: icon.success },
});
