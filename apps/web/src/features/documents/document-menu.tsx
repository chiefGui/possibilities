import { parentOf, type WriterSettings } from "@possibilities/contract";
import { useState } from "react";

import { DeleteDialog } from "@/features/documents/delete-dialog";
import { type Setting, shortcut } from "@/features/documents/editor/modes";
import type { Session } from "@/features/documents/session";
import { useCreate } from "@/features/documents/use-create";
import { Button } from "@possibilities/ui/button";
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
  const { workspaceId, path } = session.ref;
  const create = useCreate(workspaceId, "createDocument");
  const [confirming, setConfirming] = useState(false);

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
          <Menu.Item disabled={create.isPending} onClick={() => create.mutate(parentOf(path))}>
            <Icon name="add" />
            New document
          </Menu.Item>
          <Menu.Item onClick={() => setConfirming(true)}>
            <Icon name="delete" />
            Delete
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>
      <DeleteDialog
        workspaceId={workspaceId}
        entry={{ kind: "document", path }}
        open={confirming}
        onOpenChange={setConfirming}
      />
    </>
  );
}
