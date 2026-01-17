"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { DataPagination } from "@/components/data-pagination";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useRouter } from "next/navigation";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();
  const {
    data: { meetings, metadata },
  } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      page: filters.page,
      search: filters.search,
      status: filters.status,
      agentId: filters.agentId,
    }),
  );

  const handlePagination = (direction: "next" | "prev") => {
    if (direction === "next" && metadata.hasNextPage) {
      setFilters({ page: filters.page + 1 });
      return;
    }
    if (direction === "prev" && metadata.hasPreviousPage) {
      setFilters({ page: filters.page - 1 });
      return;
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DataTable
        data={meetings}
        columns={columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      {meetings.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with an AI agent in real time."
        />
      )}
      <DataPagination
        currentPage={filters.page}
        hasNextPage={metadata.hasNextPage}
        hasPreviousPage={metadata.hasPreviousPage}
        totalPages={metadata.totalPages}
        handlePagination={handlePagination}
      />
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading meetings"
      description="This may take a few seconds"
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error loading meetings"
      description="Please try again later"
    />
  );
};
