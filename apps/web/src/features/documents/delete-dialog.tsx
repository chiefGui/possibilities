import { nameOf } from "@possibilities/contract";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";

import { documentsQuery } from "@/features/documents/queries";
import { removeFolder, sessionFor } from "@/features/documents/session";
import { covers, type Entry } from "@/features/documents/tree";
import { Actions } from "@possibilities/ui/actions";
import * as AlertDialog from "@possibilities/ui/alert-dialog";
import { Button } from "@possibilities/ui/button";
import * as Form from "@possibilities/ui/form";

type DeleteDialogProps = {
  workspaceId: string;
  entry: Entry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const consequences = {
  document: "It stays in the workspace history.",
  folder: "Its documents stay in the workspace history.",
};

export function DeleteDialog({ workspaceId, entry, open, onOpenChange }: DeleteDialogProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { _splat: active } = useParams({ strict: false });

  const remove = useMutation({
    mutationFn: async () => {
      const ref = { workspaceId, path: entry.path };
      const removal = entry.kind === "document" ? sessionFor(ref).remove() : removeFolder(ref);
      if (active && covers(entry, active)) {
        await navigate({ to: "/workspaces/$workspaceId", params: { workspaceId }, replace: true });
      }
      await removal;
    },
    onSuccess: () => onOpenChange(false),
    onError: () =>
      queryClient.invalidateQueries({ queryKey: documentsQuery(workspaceId).queryKey }),
  });

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) remove.reset();
        onOpenChange(next);
      }}
    >
      <AlertDialog.Popup>
        <AlertDialog.Title>Delete {nameOf(entry.path)}?</AlertDialog.Title>
        <AlertDialog.Description>{consequences[entry.kind]}</AlertDialog.Description>
        {remove.error && <Form.Error>{remove.error.message}</Form.Error>}
        <Actions>
          <AlertDialog.Close render={<Button variant="ghost" />}>Cancel</AlertDialog.Close>
          <Button variant="danger" disabled={remove.isPending} onClick={() => remove.mutate()}>
            Delete
          </Button>
        </Actions>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
