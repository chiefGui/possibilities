import * as stylex from "@stylexjs/stylex";

const DARK = "@media (prefers-color-scheme: dark)";

export const colors = stylex.defineVars({
  background: { default: "oklch(1 0 0)", [DARK]: "oklch(0.145 0 0)" },
  foreground: { default: "oklch(0.145 0 0)", [DARK]: "oklch(0.985 0 0)" },
  primary: { default: "oklch(0.205 0 0)", [DARK]: "oklch(0.922 0 0)" },
  primaryHover: { default: "oklch(0.205 0 0 / 80%)", [DARK]: "oklch(0.922 0 0 / 80%)" },
  primaryForeground: { default: "oklch(0.985 0 0)", [DARK]: "oklch(0.205 0 0)" },
  muted: { default: "oklch(0.97 0 0)", [DARK]: "oklch(0.269 0 0)" },
  mutedForeground: { default: "oklch(0.556 0 0)", [DARK]: "oklch(0.708 0 0)" },
  border: { default: "oklch(0.922 0 0)", [DARK]: "oklch(1 0 0 / 10%)" },
  ring: { default: "oklch(0.708 0 0)", [DARK]: "oklch(0.556 0 0)" },
});

export const radii = stylex.defineVars({
  sm: "6px",
  md: "8px",
});

export const fonts = stylex.defineVars({
  sans: "'Geist Variable', system-ui, sans-serif",
});
