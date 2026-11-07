import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

import { token } from "@possibilities/ui/tokens";

const gutter = token.var("sizes.hang");
const measure = token.var("sizes.measure");
const faint = token.var("colors.text.faint");
const subtle = token.var("colors.text.subtle");
const brand = token.var("colors.border.focused");
const selection = token.var("colors.background.selection");
const calm = `${token.var("durations.calm")} ${token.var("easings.standard")}`;

const surface = EditorView.theme({
  "&": {
    height: "100%",
    color: token.var("colors.text.default"),
    backgroundColor: "transparent",
    fontFamily: token.var("fonts.writer"),
    fontSize: token.var("fontSizes.writer"),
    fontVariantLigatures: "none",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "inherit",
    lineHeight: token.var("lineHeights.writer"),
    scrollbarWidth: "thin",
  },
  ".cm-content": {
    paddingBlock: `${token.var("spacing.8")} 40vh`,
    paddingInline: `max(${gutter}, calc((100% - ${measure}) / 2))`,
    caretColor: brand,
  },
  "&.cm-typewriter .cm-content": { paddingBlock: "calc(50vh - 1lh)" },
  ".cm-line": { padding: "0" },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftWidth: token.var("sizes.caret"),
    borderLeftColor: brand,
  },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
    { backgroundColor: selection },
  ".cm-heading": { textIndent: "calc(var(--hang) * -1ch)" },
  ".cm-indented": {
    paddingInlineStart: "calc(var(--indent) * 1ch)",
    textIndent: "calc(var(--indent) * -1ch)",
  },
  ".cm-code": {
    paddingInline: token.var("spacing.0.5"),
    borderRadius: token.var("radii.xs"),
    backgroundColor: token.var("colors.background.neutral"),
  },
  "&.cm-focus .cm-line": { transition: `opacity ${calm}` },
  "&.cm-focus .cm-dimmed": { opacity: token.var("opacity.dimmed") },
});

const markdown = HighlightStyle.define([
  { tag: tags.heading, fontWeight: "700" },
  { tag: tags.strong, fontWeight: "700" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through", textDecorationColor: subtle },
  { tag: [tags.quote, tags.monospace, tags.labelName, tags.string, tags.atom], color: subtle },
  { tag: [tags.url, tags.contentSeparator, tags.comment], color: faint },
  { tag: tags.processingInstruction, color: faint, fontWeight: "400", fontStyle: "normal" },
]);

export const theme = [surface, syntaxHighlighting(markdown)];
