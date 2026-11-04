import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { colors } from "@/theme/tokens.stylex";

export const Route = createFileRoute("/")({
  component: Home,
});

const styles = stylex.create({
  title: {
    margin: 0,
    fontSize: 40,
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  link: {
    fontSize: 14,
    color: "inherit",
    textUnderlineOffset: 4,
  },
  runtime: {
    margin: 0,
    fontSize: 13,
    color: colors.mutedForeground,
  },
});

function Home() {
  const [count, setCount] = useState(0);
  const runtime = window.desktop
    ? `Electron ${window.desktop.versions.electron} · Chrome ${window.desktop.versions.chrome}`
    : "Browser";

  return (
    <>
      <h1 {...stylex.props(styles.title)}>Hello, World</h1>
      <Button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</Button>
      <Link to="/about" {...stylex.props(styles.link)}>
        About
      </Link>
      <p {...stylex.props(styles.runtime)}>{runtime}</p>
    </>
  );
}
