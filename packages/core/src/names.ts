export const safeName = (title: string) =>
  title.replace(/[/\\:*?"<>|\p{Cc}]/gu, "-").replace(/^[\s.-]+|[\s.-]+$/g, "") || "Untitled";

export const availableName = (taken: ReadonlyArray<string>, title: string, current?: string) => {
  const used = new Set(taken.filter((name) => name !== current).map((name) => name.toLowerCase()));
  const base = safeName(title);
  let candidate = base;
  for (let suffix = 2; used.has(candidate.toLowerCase()); suffix++) {
    candidate = `${base} ${suffix}`;
  }
  return candidate;
};
