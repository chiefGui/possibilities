import type { WriterSettings } from "@possibilities/contract";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { type Setting, shortcut } from "@/features/documents/editor/modes";
import { documentsQuery } from "@/features/documents/queries";
import type { Session } from "@/features/documents/session";
import { useCreateDocument } from "@/features/documents/use-create-document";
import { Actions } from "@possibilities/ui/actions";
import * as AlertDialog from "@possibilities/ui/alert-dialog";
import { Button } from "@possibilities/ui/button";
import * as Form from "@possibilities/ui/form";
import { Icon } from "@possibilities/ui/icon";
import * as Menu from "@possibilities/ui/menu";

type DocumentMenuProps = {
  session: Session;
  settings: WriterSettings;
  onToggle: (setting: Setting) => void;
};

const mac = window.desktop?.platform === "darwin";

const label = (binding: string) =>
  binding
    .split("-")
    .map((key) => {
      if (key === "Mod") return mac ? "⌘" : "Ctrl+";
      if (key === "Shift") return mac ? "⇧" : "Shift+";
      return key.toUpperCase();
    })
    .join("");

export function DocumentMenu({ session, settings, onToggle }: DocumentMenuProps) {
  const { workspaceId, projectId } = session.ref;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const create = useCreateDocument(workspaceId, projectId);
  const [confirming, setConfirming] = useState(false);

  const remove = useMutation({
    mutationFn: async () => {
      const removal = session.remove();
      await navigate({
        to: "/workspaces/$workspaceId/projects/$projectId",
        params: { workspaceId, projectId },
        replace: true,
      });
      await removal;
    },
    onError: () =>
      queryClient.invalidateQueries({ queryKey: documentsQuery(session.ref).queryKey }),
  });

  return (
    <>
      <Menu.Root>
        <Menu.Trigger render={<Button variant="ghost" aria-label="Document actions" />}>
          <Icon name="more" />
        </Menu.Trigger>
        <Menu.Popup align="end">
          <Menu.CheckboxItem
            checked={settings.focus}
            onCheckedChange={() => onToggle("focus")}
            shortcut={label(shortcut("focus"))}
          >
            Focus
          </Menu.CheckboxItem>
          <Menu.CheckboxItem
            checked={settings.typewriter}
            onCheckedChange={() => onToggle("typewriter")}
            shortcut={label(shortcut("typewriter"))}
          >
            Typewriter
          </Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.Item disabled={create.isPending} onClick={() => create.mutate()}>
            <Icon name="add" />
            New document
          </Menu.Item>
          <Menu.Item onClick={() => setConfirming(true)}>
            <Icon name="delete" />
            Delete
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>
      <AlertDialog.Root open={confirming} onOpenChange={setConfirming}>
        <AlertDialog.Popup>
          <AlertDialog.Title>Delete {session.ref.name}?</AlertDialog.Title>
          <AlertDialog.Description>
            It stays in the workspace history, but leaves this project.
          </AlertDialog.Description>
          {remove.error && <Form.Error>{remove.error.message}</Form.Error>}
          <Actions>
            <AlertDialog.Close render={<Button variant="ghost" />}>Cancel</AlertDialog.Close>
            <Button variant="danger" disabled={remove.isPending} onClick={() => remove.mutate()}>
              Delete
            </Button>
          </Actions>
        </AlertDialog.Popup>
      </AlertDialog.Root>
    </>
  );
}
