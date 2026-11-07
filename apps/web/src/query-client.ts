import { focusManager, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

focusManager.setEventListener((onFocus) => {
  const listener = () => onFocus();
  window.addEventListener("focus", listener);
  return () => window.removeEventListener("focus", listener);
});
