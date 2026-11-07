import "@fontsource/ia-writer-duo/400.css";
import "@fontsource/ia-writer-duo/400-italic.css";
import "@fontsource/ia-writer-duo/700.css";
import "@fontsource/ia-writer-duo/700-italic.css";

const faces = ["400 1em", "italic 400 1em", "700 1em", "italic 700 1em"];

let loading: Promise<unknown> | undefined;

export const writerFont = () =>
  (loading ??= Promise.all(
    faces.map((face) => document.fonts.load(`${face} 'iA Writer Duo'`)),
  ).catch(() => undefined));
