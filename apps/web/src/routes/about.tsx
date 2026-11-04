import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";

import { text, weight } from "@/theme/tokens.stylex";

export const Route = createFileRoute("/about")({
  component: About,
});

const styles = stylex.create({
  title: {
    margin: 0,
    fontSize: text.xl,
    fontWeight: weight.semibold,
  },
  link: {
    fontSize: text.md,
    color: "inherit",
    textUnderlineOffset: 4,
  },
});

function About() {
  return (
    <>
      <h1 {...stylex.props(styles.title)}>About</h1>
      <Link to="/" {...stylex.props(styles.link)}>
        Home
      </Link>
    </>
  );
}
