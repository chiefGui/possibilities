import { queryOptions } from "@tanstack/react-query";

import { call } from "@/rpc";

export const environmentQuery = queryOptions({
  queryKey: ["environment"],
  queryFn: () => call((api) => api.environment()),
});
