import { EditorSelection, type StateCommand } from "@codemirror/state";

export const toggleMark =
  (mark: string): StateCommand =>
  ({ state, dispatch }) => {
    const { length } = mark;
    const transaction = state.changeByRange((range) => {
      const wrapped =
        state.sliceDoc(range.from - length, range.from) === mark &&
        state.sliceDoc(range.to, range.to + length) === mark;
      if (wrapped) {
        return {
          changes: [
            { from: range.from - length, to: range.from },
            { from: range.to, to: range.to + length },
          ],
          range: EditorSelection.range(range.anchor - length, range.head - length),
        };
      }
      return {
        changes: [
          { from: range.from, insert: mark },
          { from: range.to, insert: mark },
        ],
        range: EditorSelection.range(range.anchor + length, range.head + length),
      };
    });
    dispatch(state.update(transaction, { scrollIntoView: true, userEvent: "input" }));
    return true;
  };
