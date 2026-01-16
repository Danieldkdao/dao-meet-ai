"use client";

import { useState } from "react";
import { NewAgentDialog } from "./new-agent-dialog";
import { AgentsSearchFilter } from "./agents-search-filter";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DEFAULT_PAGE } from "@/constants";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "lucide-react";

export const AgentHeader = () => {
  const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState(false);
  const [filters, setFilters] = useAgentsFilters();

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-medium">My Agents</h1>
        <NewAgentDialog
          open={isCreateAgentModalOpen}
          openChange={setIsCreateAgentModalOpen}
        />
      </div>
      <div className="flex items-center gap-x-2">
        <AgentsSearchFilter />
        {isAnyFilterModified && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <XCircleIcon />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};
