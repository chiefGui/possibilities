import * as stylex from "@stylexjs/stylex";

const mode = (light: string, dark: string) => `light-dark(${light}, ${dark})`;

const wash = (color: string, amount: number) =>
  `color-mix(in oklch, ${color} ${amount}%, transparent)`;

const slate = {
  1: mode("oklch(0.975 0.003 270)", "oklch(0.17 0.004 270)"),
  2: mode("oklch(1 0 0)", "oklch(0.2 0.005 270)"),
  3: mode("oklch(1 0 0)", "oklch(0.23 0.006 270)"),
  11: mode("oklch(0.52 0.015 270)", "oklch(0.68 0.015 270)"),
  12: mode("oklch(0.24 0.01 270)", "oklch(0.93 0.004 270)"),
};

const inks = { light: "oklch(0.24 0.02 270)", dark: "oklch(1 0 0)" };

const ink = mode(inks.light, inks.dark);

const indigo = mode("oklch(0.56 0.15 277)", "oklch(0.62 0.15 277)");

const green = mode("oklch(0.6 0.15 150)", "oklch(0.72 0.15 150)");

const red = mode("oklch(0.577 0.215 27)", "oklch(0.704 0.191 22)");

export const surface = stylex.defineVars({
  sunken: slate[1],
  default: slate[2],
  raised: slate[3],
});

export const background = stylex.defineVars({
  neutral: wash(ink, 6),
  hovered: wash(ink, 5),
  selected: wash(ink, 8),
  neutralBold: wash(ink, 24),
  brand: indigo,
  brandHovered: `color-mix(in oklch, ${indigo} 88%, white)`,
});

export const text = stylex.defineVars({
  default: slate[12],
  subtle: slate[11],
  inverse: "white",
  danger: red,
});

export const icon = stylex.defineVars({
  subtle: slate[11],
  success: green,
});

export const border = stylex.defineVars({
  default: mode(wash(inks.light, 12), wash(inks.dark, 8)),
  focused: indigo,
  danger: red,
});
