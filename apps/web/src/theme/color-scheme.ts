export const colorSchemes = ["system", "light", "dark"] as const;

export type ColorScheme = (typeof colorSchemes)[number];

const storageKey = "color-scheme";

const cssColorScheme: Record<ColorScheme, string> = {
  system: "light dark",
  light: "light",
  dark: "dark",
};

function isColorScheme(value: unknown): value is ColorScheme {
  return colorSchemes.includes(value as ColorScheme);
}

export function readColorScheme(): ColorScheme {
  const stored = localStorage.getItem(storageKey);
  return isColorScheme(stored) ? stored : "system";
}

export function applyColorScheme(scheme: ColorScheme) {
  document.documentElement.style.colorScheme = cssColorScheme[scheme];
  window.desktop?.setColorScheme(scheme);
}

export function setColorScheme(scheme: ColorScheme) {
  localStorage.setItem(storageKey, scheme);
  applyColorScheme(scheme);
}
