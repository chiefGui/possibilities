import { AlertDialog } from "@base-ui/react/alert-dialog";

import { css } from "../styled-system/css";
import { popup } from "./popup";
import type { Unstyled } from "./props";

export const Root = AlertDialog.Root;

export const Close = AlertDialog.Close;

export function Popup(props: Unstyled<AlertDialog.Popup.Props>) {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Backdrop className={styles.backdrop} />
      <AlertDialog.Popup {...props} className={css(popup.root, styles.popup)} />
    </AlertDialog.Portal>
  );
}

export function Title(props: Unstyled<AlertDialog.Title.Props>) {
  return <AlertDialog.Title {...props} className={styles.title} />;
}

export function Description(props: Unstyled<AlertDialog.Description.Props>) {
  return <AlertDialog.Description {...props} className={styles.description} />;
}

const styles = {
  backdrop: css({
    position: "fixed",
    inset: "0",
    backgroundColor: "background.scrim",
    appRegion: "no-drag",
    transitionProperty: "opacity",
    transitionDuration: "fast",
    transitionTimingFunction: "standard",
    _transitioning: { opacity: "0" },
  }),
  popup: css.raw({
    position: "fixed",
    inset: "0",
    gap: "4",
    width: "column",
    height: "fit-content",
    margin: "auto",
    padding: "4",
  }),
  title: css({
    margin: "0",
    fontSize: "md",
    fontWeight: "semibold",
  }),
  description: css({
    margin: "0",
    color: "text.subtle",
  }),
};
