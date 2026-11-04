import * as stylex from "@stylexjs/stylex";

const slate = {
  1: "oklch(1 0 0)",
  2: "oklch(0.975 0.003 270)",
  11: "oklch(0.52 0.015 270)",
  12: "oklch(0.24 0.01 270)",
};

const slateDark = {
  1: "oklch(0.17 0.004 270)",
  2: "oklch(0.2 0.005 270)",
  3: "oklch(0.23 0.006 270)",
  11: "oklch(0.68 0.015 270)",
  12: "oklch(0.93 0.004 270)",
};

const ink = "oklch(0.24 0.02 270)";

const inkDark = "oklch(1 0 0)";

const indigo = "oklch(0.56 0.15 277)";

const indigoDark = "oklch(0.62 0.15 277)";

const green = "oklch(0.6 0.15 150)";

const greenDark = "oklch(0.72 0.15 150)";

const red = "oklch(0.577 0.215 27)";

const redDark = "oklch(0.704 0.191 22)";

export const surface = stylex.defineVars({
  sunken: `light-dark(${slate[2]}, ${slateDark[1]})`,
  default: `light-dark(${slate[1]}, ${slateDark[2]})`,
  raised: `light-dark(${slate[1]}, ${slateDark[3]})`,
});

export const background = stylex.defineVars({
  neutral: `light-dark(color-mix(in oklch, ${ink} 6%, transparent), color-mix(in oklch, ${inkDark} 6%, transparent))`,
  hovered: `light-dark(color-mix(in oklch, ${ink} 5%, transparent), color-mix(in oklch, ${inkDark} 5%, transparent))`,
  selected: `light-dark(color-mix(in oklch, ${ink} 8%, transparent), color-mix(in oklch, ${inkDark} 8%, transparent))`,
  brand: `light-dark(${indigo}, ${indigoDark})`,
  brandHovered: `light-dark(color-mix(in oklch, ${indigo} 88%, white), color-mix(in oklch, ${indigoDark} 88%, white))`,
});

export const text = stylex.defineVars({
  default: `light-dark(${slate[12]}, ${slateDark[12]})`,
  subtle: `light-dark(${slate[11]}, ${slateDark[11]})`,
  inverse: "white",
  danger: `light-dark(${red}, ${redDark})`,
});

export const icon = stylex.defineVars({
  subtle: `light-dark(${slate[11]}, ${slateDark[11]})`,
  success: `light-dark(${green}, ${greenDark})`,
});

export const border = stylex.defineVars({
  default: `light-dark(color-mix(in oklch, ${ink} 12%, transparent), color-mix(in oklch, ${inkDark} 8%, transparent))`,
  focused: `light-dark(${indigo}, ${indigoDark})`,
  danger: `light-dark(${red}, ${redDark})`,
});
