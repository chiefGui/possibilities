import * as stylex from "@stylexjs/stylex";

export const space = stylex.defineVars({
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
  sm: "13px",
  md: "14px",
  xl: "24px",
  display: "40px",
});

export const weight = stylex.defineVars({
  medium: "500",
  semibold: "600",
});

export const font = stylex.defineVars({
  sans: "'Geist Variable', system-ui, sans-serif",
});

export const motion = stylex.defineVars({
  fast: "150ms",
});
