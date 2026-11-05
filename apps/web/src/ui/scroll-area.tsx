import { ScrollArea } from "@base-ui/react/scroll-area";
import * as stylex from "@stylexjs/stylex";

import { background } from "@/theme/colors.stylex";
import { radius, space } from "@/theme/tokens.stylex";
import type { Unstyled } from "@/ui/props";

const fade = (edge: "start" | "end") =>
  `min(${space[6]}, var(--scroll-area-overflow-y-${edge}, 0px))`;

export function Root(props: Unstyled<ScrollArea.Root.Props>) {
  return <ScrollArea.Root {...props} {...stylex.props(styles.root)} />;
}

export function Viewport(props: Unstyled<ScrollArea.Viewport.Props>) {
  return <ScrollArea.Viewport {...props} {...stylex.props(styles.viewport)} />;
}

export function Scrollbar(props: Omit<Unstyled<ScrollArea.Scrollbar.Props>, "children">) {
  return (
    <ScrollArea.Scrollbar {...props} {...stylex.props(styles.scrollbar)}>
      <ScrollArea.Thumb {...stylex.props(styles.thumb)} />
    </ScrollArea.Scrollbar>
  );
}

const styles = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  viewport: {
    flex: 1,
    minHeight: 0,
    outlineStyle: "none",
    maskImage: `linear-gradient(to bottom, transparent, black ${fade("start")}, black calc(100% - ${fade("end")}), transparent)`,
  },
  scrollbar: {
    display: "flex",
    width: space[1],
    marginBlock: space[1.5],
    marginInlineEnd: space[0.5],
    opacity: { default: 0, ":is([data-hovering], [data-scrolling])": 1 },
  },
  thumb: {
    width: "100%",
    borderRadius: radius.xs,
    backgroundColor: background.neutralBold,
  },
});
