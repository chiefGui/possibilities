import type { WriterSettings } from "@possibilities/contract";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import type { Setting } from "@/features/documents/editor/modes";
import { writerSettingsQuery } from "@/features/documents/queries";
import { call } from "@/rpc";

export function useWriterSettings() {
  const queryClient = useQueryClient();
  const settings = useSuspenseQuery(writerSettingsQuery).data;

  const save = useMutation({
    mutationFn: (next: WriterSettings) => call((api) => api.saveWriterSettings(next)),
    onMutate: (next) => {
      const previous = queryClient.getQueryData(writerSettingsQuery.queryKey);
      queryClient.setQueryData(writerSettingsQuery.queryKey, next);
      return { previous };
    },
    onError: (_error, _next, context) =>
      queryClient.setQueryData(writerSettingsQuery.queryKey, context?.previous),
  });

  const toggle = (setting: Setting) => {
    const latest = queryClient.getQueryData(writerSettingsQuery.queryKey) ?? settings;
    save.mutate({ ...latest, [setting]: !latest[setting] });
  };

  return { settings, toggle };
}
