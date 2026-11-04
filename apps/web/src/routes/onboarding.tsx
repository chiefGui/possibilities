import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { EnvironmentChecks } from "@/features/environment/environment-checks";
import { environmentQuery } from "@/features/environment/queries";
import { isReady } from "@/features/environment/steps";
import { WorkspaceForm } from "@/features/workspaces/workspace-form";
import { border, fg } from "@/theme/colors.stylex";
import { space } from "@/theme/tokens.stylex";
import { Actions } from "@/ui/actions";
import { Button } from "@/ui/button";
import * as CenteredPage from "@/ui/centered-page";

const stages = ["setup", "workspace"] as const;
type Stage = (typeof stages)[number];

export const Route = createFileRoute("/onboarding")({
  validateSearch: (search): { stage?: Stage } =>
    search.stage === "workspace" ? { stage: "workspace" } : {},
  component: Onboarding,
});

function Onboarding() {
  const navigate = Route.useNavigate();
  const { stage } = Route.useSearch();
  const environment = useQuery(environmentQuery);
  const ready = environment.data !== undefined && isReady(environment.data);
  const current: Stage = stage === "workspace" && ready ? "workspace" : "setup";

  return (
    <CenteredPage.Root>
      <Progress current={current} />
      <CenteredPage.Title>
        {current === "setup" ? "Setup" : "Create a workspace"}
      </CenteredPage.Title>
      {current === "setup" ? (
        <>
          <EnvironmentChecks environment={environment.data} />
          <Actions>
            <Button
              variant="ghost"
              disabled={environment.isFetching}
              onClick={() => void environment.refetch()}
            >
              Check again
            </Button>
            <Button
              disabled={!ready}
              onClick={() => void navigate({ search: { stage: "workspace" } })}
            >
              Continue
            </Button>
          </Actions>
        </>
      ) : (
        <WorkspaceForm>
          <Button type="button" variant="ghost" onClick={() => void navigate({ search: {} })}>
            Back
          </Button>
        </WorkspaceForm>
      )}
    </CenteredPage.Root>
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
    gap: space[1],
  },
  segment: {
    flex: 1,
    height: space[0.5],
    borderRadius: space[0.5],
    backgroundColor: border.default,
  },
  reached: {
    backgroundColor: fg.default,
  },
});
