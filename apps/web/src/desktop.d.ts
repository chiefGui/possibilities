interface Window {
  desktop?: {
    versions: { electron: string; chrome: string };
    setColorScheme: (scheme: import("./theme/color-scheme").ColorScheme) => void;
  };
}
