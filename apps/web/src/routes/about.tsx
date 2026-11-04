import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

const styles = stylex.create({
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
  },
  link: {
    fontSize: 14,
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
