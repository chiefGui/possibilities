import type { Environment } from "@possibilities/contract";

import { isDone, steps } from "@/features/environment/steps";
import { css } from "@possibilities/ui/css";
import * as Accordion from "@possibilities/ui/accordion";
import { StatusIcon } from "@possibilities/ui/status-icon";
import { text } from "@possibilities/ui/text";

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
            <span className={styles.stepTitle}>{step.title}</span>
            {environment && step.value && (
              <span className={styles.value}>{step.value(environment)}</span>
            )}
          </Accordion.Trigger>
          <Accordion.Panel>
            <ul className={styles.checks}>
              {step.checks.map((check) => {
                const passes = environment !== undefined && check.passes(environment);
                return (
                  <li key={check.label} className={styles.check}>
                    <div className={styles.checkLine}>
                      <span className={styles.dotCell}>
                        <span className={css(styles.dot, passes && styles.dotOk)} />
                      </span>
                      <span>{check.label}</span>
                    </div>
                    {environment &&
                      !passes &&
                      check.fix.map((command) => (
                        <code key={command} className={css(text.truncate, styles.fix)}>
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

const styles = {
  stepTitle: css({
    flex: "1",
    fontWeight: "medium",
    textAlign: "start",
  }),
  value: css({
    color: "text.subtle",
  }),
  checks: css({
    display: "flex",
    flexDirection: "column",
    margin: "0",
    paddingBlockEnd: "2",
    paddingInline: "3",
    listStyle: "none",
  }),
  check: css({
    display: "flex",
    flexDirection: "column",
  }),
  checkLine: css({
    display: "flex",
    alignItems: "center",
    gap: "3",
    height: "line",
    color: "text.subtle",
  }),
  dotCell: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "icon",
    flexShrink: 0,
  }),
  dot: css.raw({
    width: "1.5",
    height: "1.5",
    borderRadius: "[50%]",
    backgroundColor: "icon.subtle",
  }),
  dotOk: css.raw({
    backgroundColor: "icon.success",
  }),
  fix: css.raw({
    lineHeight: "{sizes.line}",
    paddingInlineStart: "[calc({sizes.icon} + {spacing.3})]",
    fontFamily: "mono",
    fontSize: "sm",
    color: "text.subtle",
    userSelect: "text",
  }),
};
