import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
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
  title: {
    fontSize: 40,
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  meta: {
    fontSize: 13,
    opacity: 0.6,
  },
});

function Home() {
  const [count, setCount] = useState(0);
  const runtime = window.desktop
    ? `Electron ${window.desktop.versions.electron} · Chrome ${window.desktop.versions.chrome}`
    : "Browser";

  return (
    <main {...stylex.props(styles.root)}>
      <h1 {...stylex.props(styles.title)}>Hello, World</h1>
      <Button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</Button>
      <Link to="/about" className="text-sm underline underline-offset-4">
        About
      </Link>
      <p {...stylex.props(styles.meta)}>{runtime}</p>
    </main>
  );
}
