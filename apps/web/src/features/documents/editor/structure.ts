import { syntaxTree } from "@codemirror/language";
import { countColumn, type EditorState, RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

const atxHeading = /^ATXHeading[1-6]$/;
const nestedPrefix =
  /^[\t ]*(?:>[\t ]?)*[\t ]*(?:(?:[-*+]|\d{1,9}[.)])[\t ]+(?:\[[ xX]\][\t ]+)?)?/;

const memo = <K, V>(make: (key: K) => V) => {
  const cache = new Map<K, V>();
  return (key: K) => {
    let value = cache.get(key);
    if (value === undefined) cache.set(key, (value = make(key)));
    return value;
  };
};

const heading = memo((hang: number) =>
  Decoration.line({ class: "cm-heading", attributes: { style: `--hang: ${hang}` } }),
);

const indented = memo((indent: number) =>
  Decoration.line({ class: "cm-indented", attributes: { style: `--indent: ${indent}` } }),
);

const code = Decoration.mark({ class: "cm-code" });

type Range = { from: number; to: number; value: Decoration };

const collect = (state: EditorState, from: number, to: number, ranges: Array<Range>) => {
  const nested = new Set<number>();
  syntaxTree(state).iterate({
    from,
    to,
    enter: (node) => {
      if (atxHeading.test(node.name)) {
        const mark = node.node.getChild("HeaderMark");
        const line = state.doc.lineAt(node.from);
        if (mark && mark.from === line.from) {
          ranges.push({ from: line.from, to: line.from, value: heading(mark.to - mark.from + 1) });
        }
        return false;
      }
      if (node.name === "InlineCode") {
        ranges.push({ from: node.from, to: node.to, value: code });
        return false;
      }
      if (node.name === "ListItem" || node.name === "Blockquote") {
        const start = state.doc.lineAt(Math.max(node.from, from)).number;
        const end = state.doc.lineAt(Math.min(node.to, to)).number;
        for (let number = start; number <= end; number++) nested.add(number);
      }
      if (node.name === "FencedCode" || node.name === "CodeBlock") return false;
      return undefined;
    },
  });
  for (const number of nested) {
    const line = state.doc.line(number);
    const prefix = nestedPrefix.exec(line.text)?.[0] ?? "";
    const indent = countColumn(prefix, state.tabSize);
    if (indent > 0) ranges.push({ from: line.from, to: line.from, value: indented(indent) });
  }
};

const build = (view: EditorView) => {
  const ranges: Array<Range> = [];
  for (const { from, to } of view.visibleRanges) collect(view.state, from, to, ranges);
  ranges.sort((a, b) => a.from - b.from || a.value.startSide - b.value.startSide);
  const builder = new RangeSetBuilder<Decoration>();
  for (const { from, to, value } of ranges) builder.add(from, to, value);
  return builder.finish();
};

export const structure = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = build(view);
    }
    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) !== syntaxTree(update.state)
      ) {
        this.decorations = build(update.view);
      }
    }
  },
  { decorations: (plugin) => plugin.decorations },
);
