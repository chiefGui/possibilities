import { Accordion } from "@base-ui/react/accordion";
import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Environment } from "contract";

import { CenteredPage } from "@/components/centered-page";
import { StatusIcon } from "@/components/status-icon";
import { Button } from "@/components/ui/button";
import { WorkspaceForm } from "@/components/workspace-form";
import { environmentQuery } from "@/queries";
import { colors, dimensions, fontSizes, fonts, motion, radii, space } from "@/theme/tokens.stylex";

const stages = ["setup", "workspace"] as const;
type Stage = (typeof stages)[number];

export const Route = createFileRoute("/onboarding")({
  validateSearch: (search): { stage?: Stage } =>
    search.stage === "workspace" ? { stage: "workspace" } : {},
  component: Onboarding,
});

type Check = { label: string; ok: boolean; fix: ReadonlyArray<string> };
type Step = { title: string; value?: string; checks: ReadonlyArray<Check> };

const steps = (environment: Environment): ReadonlyArray<Step> => [
  {
    title: "Git",
    checks: [
      { label: "Installed", ok: environment.git, fix: ["brew install git"] },
      {
        label: "Identity",
        ok: environment.gitIdentity,
        fix: ["git config --global user.name …", "git config --global user.email …"],
      },
    ],
  },
  {
    title: "GitHub",
    value: environment.githubLogin ?? undefined,
    checks: [
      { label: "CLI", ok: environment.gh, fix: ["brew install gh"] },
      {
        label: "Signed in",
        ok: environment.githubLogin !== null,
        fix: ["gh auth login"],
      },
    ],
  },
];

const isDone = (step: Step) => step.checks.every((check) => check.ok);

function Onboarding() {
  const navigate = Route.useNavigate();
  const { stage } = Route.useSearch();
  const environment = useQuery(environmentQuery);
  const list = environment.data ? steps(environment.data) : [];
  const ready = list.length > 0 && list.every(isDone);
  const current: Stage = stage === "workspace" && ready ? "workspace" : "setup";

  return (
    <CenteredPage
      title={current === "setup" ? "Setup" : "Create a workspace"}
      above={<Progress current={current} />}
    >
      {current === "setup" ? (
        <>
          <SetupSteps steps={list} />
          <div {...stylex.props(styles.actions)}>
            <Button
              variant="ghost"
              disabled={environment.isFetching}
              onClick={() => void environment.refetch()}
            >
              {environment.isFetching ? "Checking…" : "Check again"}
            </Button>
            <Button
              disabled={!ready}
              onClick={() => void navigate({ search: { stage: "workspace" } })}
            >
              Continue
            </Button>
          </div>
        </>
      ) : (
        <WorkspaceForm cancel={{ label: "Back", onClick: () => void navigate({ search: {} }) }} />
      )}
    </CenteredPage>
  );
}

function SetupSteps({ steps }: { steps: ReadonlyArray<Step> }) {
  const failing = steps.filter((step) => !isDone(step)).map((step) => step.title);
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
              <StatusIcon ok={isDone(step)} />
              <span {...stylex.props(styles.stepTitle)}>{step.title}</span>
              {step.value && <span {...stylex.props(styles.value)}>{step.value}</span>}
              <ChevronRight aria-hidden {...stylex.props(styles.chevron)} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel {...stylex.props(styles.panel)}>
            <ul {...stylex.props(styles.checks)}>
              {step.checks.map((check) => (
                <li key={check.label} {...stylex.props(styles.check)}>
                  <div {...stylex.props(styles.checkLine)}>
                    <span {...stylex.props(styles.dotCell)}>
                      <span {...stylex.props(styles.dot, check.ok && styles.dotOk)} />
                    </span>
                    <span>{check.label}</span>
                  </div>
                  {!check.ok &&
                    check.fix.map((command) => (
                      <code key={command} {...stylex.props(styles.fix)}>
                        {command}
                      </code>
                    ))}
                </li>
              ))}
            </ul>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

function Progress({ current }: { current: Stage }) {
  const reached = stages.indexOf(current);
  return (
    <div {...stylex.props(styles.progress)}>
      {stages.map((stage, index) => (
        <span key={stage} {...stylex.props(styles.segment, index <= reached && styles.reached)} />
      ))}
    </div>
  );
}

const styles = stylex.create({
  progress: {
    display: "flex",
    gap: space.xs,
  },
  segment: {
    flex: 1,
    height: space.xxs,
    borderRadius: space.xxs,
    backgroundColor: colors.border,
  },
  reached: {
    backgroundColor: colors.foreground,
  },
  steps: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    overflow: "hidden",
    minHeight: dimensions.row,
  },
  step: {
    borderTopWidth: { default: 1, ":first-child": 0 },
    borderTopStyle: "solid",
    borderTopColor: colors.border,
  },
  header: {
    margin: 0,
    padding: space.xs,
  },
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    width: "100%",
    height: dimensions.lg,
    paddingInline: space.sm,
    borderWidth: 0,
    borderRadius: radii.sm,
    fontFamily: "inherit",
    fontSize: fontSizes.md,
    color: colors.foreground,
    backgroundColor: { default: "transparent", ":hover": colors.muted },
    outlineStyle: "none",
  },
  stepTitle: {
    flex: 1,
    fontWeight: 500,
    textAlign: "start",
  },
  value: {
    color: colors.mutedForeground,
  },
  chevron: {
    width: dimensions.icon,
    height: dimensions.icon,
    flexShrink: 0,
    color: colors.mutedForeground,
    opacity: {
      default: 0,
      ":is(:hover > *)": 1,
      ":is(:focus-visible > *)": 1,
      ":is([data-panel-open] > *)": 1,
    },
    transform: { default: "rotate(0deg)", ":is([data-panel-open] > *)": "rotate(90deg)" },
    transitionProperty: "transform",
    transitionDuration: motion.duration,
    transitionTimingFunction: motion.easing,
  },
  panel: {
    overflow: "hidden",
    height: {
      default: "var(--accordion-panel-height)",
      ":is([data-starting-style], [data-ending-style])": 0,
    },
    transitionProperty: "height",
    transitionDuration: motion.duration,
    transitionTimingFunction: motion.easing,
  },
  checks: {
    display: "flex",
    flexDirection: "column",
    margin: 0,
    paddingBlockEnd: space.sm,
    paddingInline: space.md,
    listStyle: "none",
  },
  check: {
    display: "flex",
    flexDirection: "column",
  },
  checkLine: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    height: dimensions.line,
    color: colors.mutedForeground,
  },
  dotCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: dimensions.icon,
    flexShrink: 0,
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: colors.mutedForeground,
  },
  dotOk: {
    backgroundColor: colors.success,
  },
  fix: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    lineHeight: dimensions.line,
    paddingInlineStart: `calc(${dimensions.icon} + ${space.md})`,
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    color: colors.mutedForeground,
    userSelect: "text",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: space.sm,
  },
});
