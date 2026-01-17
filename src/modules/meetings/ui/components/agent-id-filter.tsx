import { CommandSelect } from "@/components/command-select";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useState } from "react";
import { DEFAULT_PAGE } from "@/constants";

export const AgentIdFilter = () => {
  const trpc = useTRPC();
  const [agentSearch, setAgentSearch] = useState("");
  const [filters, setFilters] = useMeetingsFilters();
  const { data: agents } = useQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch }),
  );

  return (
    <CommandSelect
      className="h-9"
      placeholder="Agent"
      options={(agents?.agents ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="size-4"
            />
            {agent.name}
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({ agentId: value, page: DEFAULT_PAGE })}
      onSearch={setAgentSearch}
      value={filters.agentId ?? ""}
    />
  );
};
