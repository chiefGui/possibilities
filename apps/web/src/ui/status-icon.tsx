import * as stylex from "@stylexjs/stylex";
import { CheckmarkCircle01Icon, CircleDashedIcon } from "@hugeicons-pro/core-stroke-rounded";

import { icon } from "@/theme/colors.stylex";
import { Icon } from "@/ui/icon";

export function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <Icon icon={CheckmarkCircle01Icon} xstyle={styles.ok} />
  ) : (
    <Icon icon={CircleDashedIcon} />
  );
}

const styles = stylex.create({
  ok: { color: icon.success },
});
