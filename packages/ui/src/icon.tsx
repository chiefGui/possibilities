import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  CircleDashedIcon,
  CloudAlertIcon,
  Delete02Icon,
  Folder01Icon,
  FolderAddIcon,
  FolderOpenIcon,
  Home01Icon,
  MoreHorizontalIcon,
  Note01Icon,
  NoteAddIcon,
  PencilEdit02Icon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { cx } from "../styled-system/css";
import { icon } from "../styled-system/recipes";

const glyphs = {
  add: Add01Icon,
  home: Home01Icon,
  document: Note01Icon,
  newDocument: NoteAddIcon,
  folder: Folder01Icon,
  openFolder: FolderOpenIcon,
  newFolder: FolderAddIcon,
  rename: PencilEdit02Icon,
  more: MoreHorizontalIcon,
  delete: Delete02Icon,
  selected: Tick01Icon,
  success: CheckmarkCircle01Icon,
  pending: CircleDashedIcon,
  failed: CloudAlertIcon,
  dropdown: ArrowDown01Icon,
  expand: ArrowRight01Icon,
};

type IconName = keyof typeof glyphs;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return <HugeiconsIcon icon={glyphs[name]} aria-hidden className={cx(icon(), className)} />;
}
