import type { Environment } from "@possibilities/contract";
import * as stylex from "@stylexjs/stylex";

import { isDone, steps } from "@/features/environment/steps";
import { fg, status } from "@/theme/colors.stylex";
import { font, size, space, text, weight } from "@/theme/tokens.stylex";
import * as Accordion from "@/ui/accordion";
import { StatusIcon } from "@/ui/status-icon";

export function EnvironmentChecks({ environment }: { environment: Environment | undefined }) {
  const failing = environment
    ? steps.filter((step) => !isDone(step, environment)).map((step) => step.title)
    : [];
  return (
    <Accordion.Root key={failing.join()} multiple defaultValue={failing}>
      {steps.map((step) => (
        <Accordion.Item key={step.title} value={step.title}>
          <Accordion.Trigger>
            <StatusIcon ok={environment !== undefined && isDone(step, environment)} />
            <span {...stylex.props(styles.stepTitle)}>{step.title}</span>
            {environment && step.value && (
              <span {...stylex.props(styles.value)}>{step.value(environment)}</span>
            )}
          </Accordion.Trigger>
          <Accordion.Panel>
            <ul {...stylex.props(styles.checks)}>
              {step.checks.map((check) => {
                const passes = environment !== undefined && check.passes(environment);
                return (
                  <li key={check.label} {...stylex.props(styles.check)}>
                    <div {...stylex.props(styles.checkLine)}>
                      <span {...stylex.props(styles.dotCell)}>
                        <span {...stylex.props(styles.dot, passes && styles.dotOk)} />
                      </span>
                      <span>{check.label}</span>
                    </div>
                    {environment &&
                      !passes &&
                      check.fix.map((command) => (
                        <code key={command} {...stylex.props(styles.fix)}>
                          {command}
                        </code>
                      ))}
                  </li>
                );
              })}
            </ul>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

const styles = stylex.create({
  stepTitle: {
    flex: 1,
    fontWeight: weight.medium,
    textAlign: "start",
  },
  value: {
    color: fg.muted,
  },
  checks: {
    display: "flex",
    flexDirection: "column",
    margin: 0,
    paddingBlockEnd: space[2],
    paddingInline: space[3],
    listStyle: "none",
  },
  check: {
    display: "flex",
    flexDirection: "column",
  },
  checkLine: {
    display: "flex",
    alignItems: "center",
    gap: space[3],
    height: size.line,
    color: fg.muted,
  },
  dotCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: size.icon,
    flexShrink: 0,
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: fg.muted,
  },
  dotOk: {
    backgroundColor: status.success,
  },
  fix: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    lineHeight: size.line,
    paddingInlineStart: `calc(${size.icon} + ${space[3]})`,
    fontFamily: font.mono,
    fontSize: text.sm,
    color: fg.muted,
    userSelect: "text",
  },
});
