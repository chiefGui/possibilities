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
  surface: { default: "oklch(0.985 0 0)", [DARK]: "oklch(0.18 0 0)" },
  success: { default: "oklch(0.6 0.15 150)", [DARK]: "oklch(0.72 0.15 150)" },
  danger: { default: "oklch(0.577 0.215 27)", [DARK]: "oklch(0.704 0.191 22)" },
});

export const radii = stylex.defineVars({
  sm: "6px",
  md: "8px",
});

export const fonts = stylex.defineVars({
  sans: "'Geist Variable', system-ui, sans-serif",
  mono: "ui-monospace, monospace",
});

export const fontSizes = stylex.defineVars({
  xs: "11px",
  sm: "12px",
  md: "13px",
  xl: "20px",
});

export const space = stylex.defineVars({
  xxs: "2px",
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
});

export const motion = stylex.defineVars({
  duration: "100ms",
  easing: "cubic-bezier(0.2, 0, 0, 1)",
});

export const dimensions = stylex.defineVars({
  icon: "16px",
  line: "24px",
  sm: "28px",
  md: "32px",
  lg: "36px",
  row: "44px",
});
