import {
  AgentView,
  AgentViewError,
  AgentViewLoading,
} from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AgentHeader } from "@/modules/agents/ui/components/agent-header";

type AgentsPageProps = Promise<{
  query?: string;
  page?: string;
}>;

const AgentsPage = async ({
  searchParams,
}: {
  searchParams: AgentsPageProps;
}) => {
  const { query, page } = await searchParams;
  const parsedPage = Number(page) || 1;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({ search: query, page: parsedPage })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-svh p-5 flex flex-col gap-4">
        <AgentHeader />
        <Suspense fallback={<AgentViewLoading />}>
          <ErrorBoundary fallback={<AgentViewError />}>
            <AgentView query={query} page={parsedPage} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

export default AgentsPage;
