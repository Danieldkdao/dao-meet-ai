"use client";

import { LoadingState } from "@/components/loading-state";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";

type AgentViewProps = {
  query: string | undefined;
  page: number;
};

export const AgentView = ({ query, page }: AgentViewProps) => {
  const trpc = useTRPC();
  const { data: agents } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ search: query, page })
  );
  return (
    <div className="flex-1 pb-4 flex flex-col gap-y-4">
      <DataTable data={agents.agents} columns={columns} />
      {agents.agents.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};

export const AgentViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
};

export const AgentViewError = () => {
  return (
    <ErrorState
      title="Error loading agents"
      description="Please try again later."
    />
  );
};
