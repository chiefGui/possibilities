import { defineConfig } from "@pandacss/dev";
import base from "@pandacss/preset-base";

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

const values = (scale: Record<string, string>) =>
  Object.fromEntries(Object.entries(scale).map(([key, value]) => [key, { value }]));

export default defineConfig({
  presets: [base],
  preflight: false,
  include: ["src/**/*.{ts,tsx}"],
  outdir: "styled-system",
  utilities: {
    appRegion: {
      values: ["drag", "no-drag"],
      transform: (value: string) => ({ "-webkit-app-region": value }),
    },
  },
  conditions: {
    transitioning: "&:is([data-starting-style], [data-ending-style])",
  },
  theme: {
    tokens: {
      colors: {
        surface: values({ sunken: slate[1], default: slate[2], raised: slate[3] }),
        background: values({
          neutral: wash(ink, 6),
          hovered: wash(ink, 5),
          selected: wash(ink, 8),
          neutralBold: wash(ink, 24),
          brand: indigo,
          brandHovered: `color-mix(in oklch, ${indigo} 88%, white)`,
        }),
        text: values({ default: slate[12], subtle: slate[11], inverse: "white", danger: red }),
        icon: values({ subtle: slate[11], success: green, danger: red }),
        border: values({
          default: mode(wash(inks.light, 12), wash(inks.dark, 8)),
          hovered: mode(wash(inks.light, 24), wash(inks.dark, 16)),
          focused: indigo,
          danger: red,
        }),
      },
      spacing: values({
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
      }),
      radii: values({ xs: "4px", sm: "6px", md: "8px", lg: "12px" }),
      fontSizes: values({ xs: "11px", sm: "12px", md: "13px", xl: "20px" }),
      fontWeights: values({ regular: "400", medium: "500", semibold: "600" }),
      fonts: values({
        sans: "'Inter Variable', system-ui, sans-serif",
        mono: "ui-monospace, monospace",
      }),
      sizes: values({
        icon: "16px",
        line: "24px",
        sm: "28px",
        md: "32px",
        lg: "36px",
        row: "44px",
        trafficLights: "76px",
        sidebar: "240px",
        column: "420px",
        popup: "220px",
      }),
      easings: values({ standard: "cubic-bezier(0.2, 0, 0, 1)" }),
      shadows: values({
        raised: "0 1px 2px oklch(0 0 0 / 8%)",
        overlay: "0 4px 16px oklch(0 0 0 / 16%)",
      }),
      opacity: values({ disabled: "0.5" }),
    },
    recipes: {
      icon: {
        className: "icon",
        base: { flexShrink: 0, width: "icon", height: "icon", color: "icon.subtle" },
      },
    },
    semanticTokens: {
      durations: {
        fast: { value: { base: "100ms", _motionReduce: "0ms" } },
      },
    },
  },
});
