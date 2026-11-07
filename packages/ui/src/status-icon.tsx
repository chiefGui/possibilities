import { css } from "../styled-system/css";
import { Icon } from "./icon";

export function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? <Icon name="success" className={success} /> : <Icon name="pending" />;
}

const success = css({ color: "icon.success" });
