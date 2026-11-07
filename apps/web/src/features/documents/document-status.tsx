import { useSyncExternalStore } from "react";

import type { Stats } from "@/features/documents/editor/words";
import type { Session } from "@/features/documents/session";
import { css } from "@possibilities/ui/css";

const number = new Intl.NumberFormat();

const words = (count: number) => `${number.format(count)} ${count === 1 ? "word" : "words"}`;

export function DocumentStatus({ session, stats }: { session: Session; stats: Stats | null }) {
  const status = useSyncExternalStore(session.subscribe, session.saveStatus);

  return (
    <span className={styles.status}>
      {status === "failed" && <span className={styles.failed}>Not saved</span>}
      {stats &&
        (stats.selected > 0
          ? `${number.format(stats.selected)} of ${words(stats.words)}`
          : words(stats.words))}
    </span>
  );
}

const styles = {
  status: css({
    display: "flex",
    gap: "3",
    fontSize: "sm",
    fontWeight: "regular",
    fontVariantNumeric: "tabular-nums",
    color: "text.subtle",
    whiteSpace: "nowrap",
  }),
  failed: css({ color: "text.danger" }),
};
