"use client";

import { LoadingState } from "@/components/loading-state";
import { columns } from "../components/columns";
import { DataTable } from "@/components/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { DataPagination } from "../../../../components/data-pagination";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { useRouter } from "next/navigation";

export const AgentView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();
  const {
    data: { agents, metadata },
  } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      search: filters.search,
      page: filters.page,
    }),
  );

  const handlePagination = (direction: "prev" | "next") => {
    if (direction === "next" && metadata.hasNextPage) {
      setFilters({ page: filters.page + 1 });
      return;
    }
    if (direction === "prev" && metadata.hasPreviousPage) {
      setFilters({ page: filters.page - 1 });
    }
  };

  return (
    <div className="flex-1 pb-4 flex flex-col gap-y-4">
      <DataTable
        data={agents}
        columns={columns}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
      />
      <DataPagination
        currentPage={filters.page}
        totalPages={metadata.totalPages}
        hasNextPage={metadata.hasNextPage}
        hasPreviousPage={metadata.hasPreviousPage}
        handlePagination={handlePagination}
      />
      {agents.length === 0 && (
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
