import { Accordion } from "@base-ui/react/accordion";
import type { Environment } from "@possibilities/contract";
import * as stylex from "@stylexjs/stylex";
import { ChevronRight } from "lucide-react";

import { isDone, steps } from "@/features/environment/steps";
import { bg, border, fg, status } from "@/theme/colors.stylex";
import { font, motion, radius, size, space, text, weight } from "@/theme/tokens.stylex";
import { StatusIcon } from "@/ui/status-icon";

export function EnvironmentChecks({ environment }: { environment: Environment | undefined }) {
  const failing = environment
    ? steps.filter((step) => !isDone(step, environment)).map((step) => step.title)
    : [];
  return (
    <Accordion.Root
      key={failing.join()}
      multiple
      defaultValue={failing}
      {...stylex.props(styles.steps)}
    >
      {steps.map((step) => (
        <Accordion.Item key={step.title} value={step.title} {...stylex.props(styles.step)}>
          <Accordion.Header {...stylex.props(styles.header)}>
            <Accordion.Trigger {...stylex.props(styles.trigger)}>
              <StatusIcon ok={environment !== undefined && isDone(step, environment)} />
              <span {...stylex.props(styles.stepTitle)}>{step.title}</span>
              {environment && step.value && (
                <span {...stylex.props(styles.value)}>{step.value(environment)}</span>
              )}
              <ChevronRight aria-hidden {...stylex.props(styles.chevron)} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel {...stylex.props(styles.panel)}>
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
  steps: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: border.default,
    borderRadius: radius.md,
    backgroundColor: bg.surface,
    overflow: "hidden",
  },
  step: {
    borderTopWidth: { default: 1, ":first-child": 0 },
    borderTopStyle: "solid",
    borderTopColor: border.default,
  },
  header: {
    margin: 0,
    padding: space[1],
  },
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: space[3],
    width: "100%",
    height: size.lg,
    paddingInline: space[2],
    borderWidth: 0,
    borderRadius: radius.sm,
    fontFamily: "inherit",
    fontSize: text.md,
    color: fg.default,
    backgroundColor: { default: "transparent", ":hover": bg.hover },
    outlineStyle: "none",
  },
  stepTitle: {
    flex: 1,
    fontWeight: weight.medium,
    textAlign: "start",
  },
  value: {
    color: fg.muted,
  },
  chevron: {
    width: size.icon,
    height: size.icon,
    flexShrink: 0,
    color: fg.muted,
    opacity: {
      default: 0,
      ":is(:hover > *)": 1,
      ":is(:focus-visible > *)": 1,
      ":is([data-panel-open] > *)": 1,
    },
    transform: { default: "rotate(0deg)", ":is([data-panel-open] > *)": "rotate(90deg)" },
    transitionProperty: "transform",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.easing,
  },
  panel: {
    overflow: "hidden",
    height: {
      default: "var(--accordion-panel-height)",
      ":is([data-starting-style], [data-ending-style])": 0,
    },
    transitionProperty: "height",
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.easing,
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
