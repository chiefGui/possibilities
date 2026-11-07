import { ScrollArea } from "@base-ui/react/scroll-area";

import { css } from "../styled-system/css";
import type { Unstyled } from "./props";

export function Root(props: Unstyled<ScrollArea.Root.Props>) {
  return <ScrollArea.Root {...props} className={styles.root} />;
}

export function Viewport(props: Unstyled<ScrollArea.Viewport.Props>) {
  return <ScrollArea.Viewport {...props} className={styles.viewport} />;
}

export function Scrollbar(props: Omit<Unstyled<ScrollArea.Scrollbar.Props>, "children">) {
  return (
    <ScrollArea.Scrollbar {...props} className={styles.scrollbar}>
      <ScrollArea.Thumb className={styles.thumb} />
    </ScrollArea.Scrollbar>
  );
}

const styles = {
  root: css({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minHeight: "0",
  }),
  viewport: css({
    flex: "1",
    minHeight: "0",
    outlineStyle: "none",
    maskImage:
      "linear-gradient(to bottom, transparent, black min({spacing.6}, var(--scroll-area-overflow-y-start, 0px)), black calc(100% - min({spacing.6}, var(--scroll-area-overflow-y-end, 0px))), transparent)",
  }),
  scrollbar: css({
    display: "flex",
    width: "1",
    marginBlock: "1.5",
    marginInlineEnd: "0.5",
    opacity: "0",
    "&:is([data-hovering], [data-scrolling])": { opacity: "1" },
  }),
  thumb: css({
    width: "full",
    borderRadius: "xs",
    backgroundColor: "background.neutralBold",
  }),
};
