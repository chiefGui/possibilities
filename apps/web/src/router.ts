import { createBrowserHistory, createHashHistory, createRouter } from "@tanstack/react-router";

import { queryClient } from "./query-client";
import { routeTree } from "./routeTree.gen";

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
