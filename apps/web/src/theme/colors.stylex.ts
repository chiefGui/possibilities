import * as stylex from "@stylexjs/stylex";

const gray = {
  1: "oklch(0.995 0 0)",
  2: "oklch(0.98 0 0)",
  3: "oklch(0.96 0 0)",
  4: "oklch(0.94 0 0)",
  5: "oklch(0.92 0 0)",
  6: "oklch(0.9 0 0)",
  7: "oklch(0.87 0 0)",
  8: "oklch(0.8 0 0)",
  9: "oklch(0.62 0 0)",
  10: "oklch(0.58 0 0)",
  11: "oklch(0.5 0 0)",
  12: "oklch(0.2 0 0)",
};

const grayDark = {
  1: "oklch(0.145 0 0)",
  2: "oklch(0.18 0 0)",
  3: "oklch(0.22 0 0)",
  4: "oklch(0.25 0 0)",
  5: "oklch(0.28 0 0)",
  6: "oklch(0.31 0 0)",
  7: "oklch(0.36 0 0)",
  8: "oklch(0.44 0 0)",
  9: "oklch(0.56 0 0)",
  10: "oklch(0.62 0 0)",
  11: "oklch(0.72 0 0)",
  12: "oklch(0.95 0 0)",
};

const green = {
  9: "oklch(0.6 0.15 150)",
};

const greenDark = {
  9: "oklch(0.72 0.15 150)",
};

const red = {
  9: "oklch(0.577 0.215 27)",
};

const redDark = {
  9: "oklch(0.704 0.191 22)",
};

export const surface = stylex.defineVars({
  default: `light-dark(${gray[1]}, ${grayDark[1]})`,
  raised: `light-dark(${gray[2]}, ${grayDark[2]})`,
});

export const background = stylex.defineVars({
  neutral: `light-dark(${gray[4]}, ${grayDark[4]})`,
  hovered: `light-dark(${gray[4]}, ${grayDark[4]})`,
  selected: `light-dark(${gray[4]}, ${grayDark[4]})`,
  brand: `light-dark(${gray[12]}, ${grayDark[12]})`,
  brandHovered: `light-dark(color-mix(in oklch, ${gray[12]} 85%, ${gray[1]}), color-mix(in oklch, ${grayDark[12]} 85%, ${grayDark[1]}))`,
});

export const text = stylex.defineVars({
  default: `light-dark(${gray[12]}, ${grayDark[12]})`,
  subtle: `light-dark(${gray[11]}, ${grayDark[11]})`,
  inverse: `light-dark(${gray[1]}, ${grayDark[1]})`,
  danger: `light-dark(${red[9]}, ${redDark[9]})`,
});

export const icon = stylex.defineVars({
  subtle: `light-dark(${gray[11]}, ${grayDark[11]})`,
  success: `light-dark(${green[9]}, ${greenDark[9]})`,
});

export const border = stylex.defineVars({
  default: `light-dark(${gray[7]}, ${grayDark[7]})`,
  focused: `light-dark(${gray[8]}, ${grayDark[8]})`,
  danger: `light-dark(${red[9]}, ${redDark[9]})`,
});
