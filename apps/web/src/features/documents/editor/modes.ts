import { Compartment, EditorState, type Extension, RangeSetBuilder } from "@codemirror/state";
import {
  type Command,
  Decoration,
  type DecorationSet,
  EditorView,
  type KeyBinding,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import type { WriterSettings } from "@possibilities/contract";

const dimmed = Decoration.line({ class: "cm-dimmed" });

const blank = (text: string) => text.trim() === "";

const paragraph = (state: EditorState) => {
  const { doc } = state;
  const line = doc.lineAt(state.selection.main.head);
  if (blank(line.text)) return { first: line.number, last: line.number };
  let first = line.number;
  let last = line.number;
  while (first > 1 && !blank(doc.line(first - 1).text)) first--;
  while (last < doc.lines && !blank(doc.line(last + 1).text)) last++;
  return { first, last };
};

const dim = (view: EditorView) => {
  const { doc } = view.state;
  const { first, last } = paragraph(view.state);
  const builder = new RangeSetBuilder<Decoration>();
  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to;) {
      const line = doc.lineAt(pos);
      if (line.number < first || line.number > last) builder.add(line.from, line.from, dimmed);
      pos = line.to + 1;
    }
  }
  return builder.finish();
};

const focus = [
  EditorView.editorAttributes.of({ class: "cm-focus" }),
  ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = dim(view);
      }
      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet || update.viewportChanged) {
          this.decorations = dim(update.view);
        }
      }
    },
    { decorations: (plugin) => plugin.decorations },
  ),
];

const typewriter = [
  EditorView.editorAttributes.of({ class: "cm-typewriter" }),
  EditorState.transactionExtender.of((transaction) =>
    (transaction.docChanged || transaction.selection) &&
    !transaction.isUserEvent("select.pointer") &&
    ["input", "delete", "move", "select", "undo", "redo"].some((event) =>
      transaction.isUserEvent(event),
    )
      ? {
          effects: EditorView.scrollIntoView(transaction.newSelection.main.head, { y: "center" }),
        }
      : null,
  ),
];

export const center = (view: EditorView) =>
  view.dispatch({
    effects: EditorView.scrollIntoView(view.state.selection.main.head, { y: "center" }),
  });

export type Setting = keyof WriterSettings;

type Mode = { extension: Extension; compartment: Compartment; shortcut: string };

const registry: Record<Setting, Mode> = {
  focus: { extension: focus, compartment: new Compartment(), shortcut: "Shift-Mod-f" },
  typewriter: { extension: typewriter, compartment: new Compartment(), shortcut: "Shift-Mod-t" },
};

const entries = Object.entries(registry) as Array<[Setting, Mode]>;

const each =
  <A>(apply: (compartment: Compartment, extension: Extension) => A) =>
  (settings: WriterSettings) =>
    entries.map(([setting, { compartment, extension }]) =>
      apply(compartment, settings[setting] ? extension : []),
    );

export const modes = each((compartment, extension) => compartment.of(extension));

export const reconfigure = each((compartment, extension) => compartment.reconfigure(extension));

export const shortcut = (setting: Setting) => registry[setting].shortcut;

export const modeKeymap = (toggle: (setting: Setting) => Command): ReadonlyArray<KeyBinding> =>
  entries.map(([setting, { shortcut }]) => ({ key: shortcut, run: toggle(setting) }));
