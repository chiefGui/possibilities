# AGENTS

## Code

- No comments or docstrings. Needing one means the design or naming is wrong; fix that instead.
- Only `rpc.ts` imports `@possibilities/scenarios`, dev-only.

## Verification

- Let the user eye-ball when it's visual.
- Do not write unit tests.

## Docs

- Docs hold only rules the code can't show, and licenses. No descriptions, tours, procedures or examples that restate code.
- State the general rule, not the case that prompted it.

## Git

- Commits and PR titles follow Conventional Commits: `type(scope): summary`.
- Don't add yourself as co-author.

## Pull Requests

Body follows this structure, in lean language, nothing more:

```markdown
## What

<the technical pitch, two sentences at most>

## Why it matters

<the value, to someone who doesn't read code, two sentences at most>

## Before vs after

<plain English; a table when comparing more than one thing>

## Caveats

<tradeoffs, limitations, what's left out; omit the section if none>
```

Describe the branch as it stands, not the conversation that produced it. When the branch changes, rewrite the body to match. Never append updates.
