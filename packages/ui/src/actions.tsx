import type { ReactNode } from "react";

import { css } from "../styled-system/css";

export function Actions({ children }: { children: ReactNode }) {
  return <div className={actions}>{children}</div>;
}

const actions = css({
  display: "flex",
  justifyContent: "flex-end",
  gap: "2",
});
