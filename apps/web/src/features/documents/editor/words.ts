import type { EditorState, Text } from "@codemirror/state";

const word = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;

const count = (text: Text) => {
  let total = 0;
  for (const line of text.iterLines()) {
    for (const _ of line.matchAll(word)) total++;
  }
  return total;
};

export type Stats = { words: number; selected: number };

export const stats = (state: EditorState): Stats => {
  const selected = state.selection.ranges.reduce(
    (total, range) => (range.empty ? total : total + count(state.doc.slice(range.from, range.to))),
    0,
  );
  return { words: count(state.doc), selected };
};
