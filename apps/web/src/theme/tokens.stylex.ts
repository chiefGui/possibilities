import * as stylex from "@stylexjs/stylex";

export const space = stylex.defineVars({
  0.5: "2px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
});

export const radius = stylex.defineVars({
  sm: "6px",
  md: "8px",
});

export const text = stylex.defineVars({
  xs: "11px",
  sm: "12px",
  md: "13px",
  xl: "20px",
});

export const weight = stylex.defineVars({
  medium: "500",
  semibold: "600",
});

export const font = stylex.defineVars({
  sans: "'Geist Variable', system-ui, sans-serif",
  mono: "ui-monospace, monospace",
});

export const size = stylex.defineVars({
  icon: "16px",
  line: "24px",
  sm: "28px",
  md: "32px",
  lg: "36px",
  row: "44px",
});

export const motion = stylex.defineVars({
  fast: "100ms",
  easing: "cubic-bezier(0.2, 0, 0, 1)",
});

export const shadow = stylex.defineVars({
  sm: "0 1px 2px oklch(0 0 0 / 8%)",
});

export const ring = stylex.defineVars({
  width: "3px",
  offset: "1px",
});

export const opacity = stylex.defineVars({
  disabled: "0.5",
});
