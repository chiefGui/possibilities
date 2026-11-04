import { queryOptions, useQuery } from "@tanstack/react-query";

import { call } from "@/rpc";

export const ownersQuery = queryOptions({
  queryKey: ["owners"],
  queryFn: () => call((api) => api.owners()),
  staleTime: Infinity,
});

export const repositoriesQuery = (owner: string) =>
  queryOptions({
    queryKey: ["owners", owner, "repositories"],
    queryFn: () => call((api) => api.repositories({ owner })),
    staleTime: Infinity,
  });

export function useOwner(selected: string | null) {
  const viewer = useQuery(ownersQuery).data?.[0] ?? null;
  return selected ?? viewer;
}
