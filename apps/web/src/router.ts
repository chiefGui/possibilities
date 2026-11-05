import { focusManager, QueryClient } from "@tanstack/react-query";
import { createBrowserHistory, createHashHistory, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient();

focusManager.setEventListener((onFocus) => {
  const listener = () => onFocus();
  window.addEventListener("focus", listener);
  return () => window.removeEventListener("focus", listener);
});

export const router = createRouter({
  routeTree,
  context: { queryClient },
  history: location.protocol === "file:" ? createHashHistory() : createBrowserHistory(),
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
