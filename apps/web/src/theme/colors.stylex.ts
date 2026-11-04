import * as stylex from "@stylexjs/stylex";

import { gray, grayDark } from "./primitives.stylex";

export const bg = stylex.defineVars({
  canvas: `light-dark(${gray[1]}, ${grayDark[1]})`,
  surface: `light-dark(${gray[2]}, ${grayDark[2]})`,
  hover: `light-dark(${gray[4]}, ${grayDark[4]})`,
  active: `light-dark(${gray[5]}, ${grayDark[5]})`,
});

export const fg = stylex.defineVars({
  default: `light-dark(${gray[12]}, ${grayDark[12]})`,
  muted: `light-dark(${gray[11]}, ${grayDark[11]})`,
  subtle: `light-dark(${gray[9]}, ${grayDark[9]})`,
  onAccent: `light-dark(${gray[1]}, ${grayDark[1]})`,
});

export const border = stylex.defineVars({
  subtle: `light-dark(${gray[6]}, ${grayDark[6]})`,
  default: `light-dark(${gray[7]}, ${grayDark[7]})`,
  strong: `light-dark(${gray[8]}, ${grayDark[8]})`,
  focus: `light-dark(${gray[8]}, ${grayDark[8]})`,
});

export const accent = stylex.defineVars({
  solid: `light-dark(${gray[12]}, ${grayDark[12]})`,
  solidHover: `light-dark(color-mix(in oklch, ${gray[12]} 85%, ${gray[1]}), color-mix(in oklch, ${grayDark[12]} 85%, ${grayDark[1]}))`,
  subtle: `light-dark(${gray[3]}, ${grayDark[3]})`,
  fg: `light-dark(${gray[12]}, ${grayDark[12]})`,
});

export const status = stylex.defineVars({
  success: "light-dark(oklch(0.6 0.15 150), oklch(0.72 0.15 150))",
  danger: "light-dark(oklch(0.577 0.215 27), oklch(0.704 0.191 22))",
});
