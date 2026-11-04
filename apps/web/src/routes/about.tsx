import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    minHeight: "100vh",
  },
});

function About() {
  return (
    <main {...stylex.props(styles.root)}>
      <h1 className="text-2xl font-semibold">About</h1>
      <Link to="/" className="text-sm underline underline-offset-4">
        Home
      </Link>
    </main>
  );
}
