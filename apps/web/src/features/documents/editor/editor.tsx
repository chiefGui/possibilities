import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdownKeymap, markdownLanguage, pasteURLAsLink } from "@codemirror/lang-markdown";
import { LanguageSupport } from "@codemirror/language";
import { Annotation, EditorSelection, EditorState, Transaction } from "@codemirror/state";
import { drawSelection, dropCursor, EditorView, keymap, type ViewUpdate } from "@codemirror/view";
import type { Document, DocumentView, WriterSettings } from "@possibilities/contract";
import { useEffect, useEffectEvent, useLayoutEffect, useRef } from "react";

import { toggleMark } from "@/features/documents/editor/commands";
import {
  center,
  modeKeymap,
  modes,
  reconfigure,
  type Setting,
} from "@/features/documents/editor/modes";
import { structure } from "@/features/documents/editor/structure";
import { theme } from "@/features/documents/editor/theme";
import { type Stats, stats } from "@/features/documents/editor/words";
import type { Session } from "@/features/documents/session";
import { css } from "@possibilities/ui/css";

type Handlers = {
  update: (update: ViewUpdate) => void;
  track: () => void;
  toggle: (setting: Setting) => void;
};

const handlers = new WeakMap<EditorView, Handlers>();

const remote = Annotation.define<boolean>();

const toggle = (setting: Setting) => (view: EditorView) => {
  handlers.get(view)?.toggle(setting);
  return true;
};

const extensions = [
  history(),
  drawSelection({ cursorBlinkRate: 1200 }),
  dropCursor(),
  EditorView.lineWrapping,
  new LanguageSupport(markdownLanguage, [pasteURLAsLink]),
  keymap.of([
    { key: "Mod-b", run: toggleMark("**") },
    { key: "Mod-i", run: toggleMark("_") },
    ...modeKeymap(toggle),
    ...markdownKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    indentWithTab,
  ]),
  EditorView.contentAttributes.of({
    spellcheck: "true",
    autocorrect: "on",
    autocapitalize: "sentences",
    "aria-label": "Document",
  }),
  EditorView.updateListener.of((update) => handlers.get(update.view)?.update(update)),
  EditorView.domEventObservers({
    scroll: (_event, view) => handlers.get(view)?.track(),
  }),
  theme,
  structure,
];

const clamp = (position: number, content: string) =>
  Math.min(Math.max(0, position), content.length);

const snapshot = (view: EditorView): DocumentView => {
  const { anchor, head } = view.state.selection.main;
  const offset = view.scrollDOM.getBoundingClientRect().top - view.documentTop;
  return { anchor, head, top: view.lineBlockAtHeight(Math.max(0, offset)).from };
};

const fresh = ({ content, view }: Document, settings: WriterSettings) => ({
  state: EditorState.create({
    doc: content,
    extensions: [extensions, modes(settings)],
    ...(view && {
      selection: EditorSelection.single(clamp(view.anchor, content), clamp(view.head, content)),
    }),
  }),
  scroll: view ? EditorView.scrollIntoView(clamp(view.top, content), { y: "start" }) : null,
});

const difference = (from: string, to: string) => {
  const limit = Math.min(from.length, to.length);
  let start = 0;
  while (start < limit && from.charCodeAt(start) === to.charCodeAt(start)) start++;
  let end = 0;
  while (
    end < limit - start &&
    from.charCodeAt(from.length - 1 - end) === to.charCodeAt(to.length - 1 - end)
  ) {
    end++;
  }
  return { from: start, to: from.length - end, insert: to.slice(start, to.length - end) };
};

const statsDelay = 400;

type EditorProps = {
  session: Session;
  document: Document;
  settings: WriterSettings;
  onStats: (stats: Stats) => void;
  onToggle: (setting: Setting) => void;
};

export function Editor({ session, document, settings, onStats, onToggle }: EditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView | null>(null);

  const report = useEffectEvent(onStats);
  const flip = useEffectEvent(onToggle);
  const current = useEffectEvent(() => ({ document, settings }));

  useLayoutEffect(() => {
    const parent = host.current;
    if (!parent) return;
    const initial = current();
    const resumed = session.resume(initial.document.content);
    const { state, scroll } = resumed ?? fresh(initial.document, initial.settings);
    if (!resumed) session.adopt(initial.document.content);

    const view = new EditorView({ state, parent, ...(scroll && { scrollTo: scroll }) });

    let statsTimer: ReturnType<typeof setTimeout> | undefined;
    const measure = (delay: number) => {
      clearTimeout(statsTimer);
      statsTimer = setTimeout(() => report(stats(view.state)), delay);
    };
    const track = () => session.trackView(() => snapshot(view));
    handlers.set(view, {
      track,
      toggle: (setting) => flip(setting),
      update: (update) => {
        if (update.transactions.some((tr) => tr.docChanged && !tr.annotation(remote))) {
          session.edit(update.state.doc);
        }
        if (update.docChanged || update.selectionSet) {
          track();
          measure(statsDelay);
        }
      },
    });

    editor.current = view;
    measure(0);
    view.focus();

    return () => {
      clearTimeout(statsTimer);
      const last = snapshot(view);
      session.suspend(view.state, view.scrollSnapshot());
      session.trackView(() => last);
      session.saveView();
      void session.flush();
      handlers.delete(view);
      view.destroy();
      editor.current = null;
    };
  }, [session]);

  useLayoutEffect(() => {
    const view = editor.current;
    if (!view) return;
    view.dispatch({ effects: reconfigure(settings) });
    if (settings.typewriter) center(view);
  }, [settings]);

  useEffect(() => {
    const view = editor.current;
    if (!view || !session.diverged(document.content)) return;
    const previous = view.state.doc.toString();
    session.adopt(document.content);
    if (previous === document.content) return;
    view.dispatch({
      changes: difference(previous, document.content),
      annotations: [remote.of(true), Transaction.addToHistory.of(false)],
    });
  }, [document.content, session]);

  return <div ref={host} className={root} />;
}

const root = css({
  flex: "1",
  minHeight: "0",
});
