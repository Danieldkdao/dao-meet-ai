import {
  AgentIdError,
  AgentIdLoading,
  AgentIdView,
} from "@/modules/agents/ui/views/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const AgentIdPage = async ({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) => {
  const { agentId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-svh p-5 flex flex-col gap-4">
        <Suspense fallback={<AgentIdLoading />}>
          <ErrorBoundary fallback={<AgentIdError />}>
            <AgentIdView agentId={agentId} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default AgentIdPage;
