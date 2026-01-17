import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { SearchIcon, XCircleIcon } from "lucide-react";
import { AgentIdFilter } from "./agent-id-filter";
import { StatusFilter } from "./status-filter";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/constants";

export const MeetingsFilters = () => {
  const [filters, setFilters] = useMeetingsFilters();

  const isAnyFilterModified =
    filters.agentId || filters.search || filters.status;

  const onClearFilters = () => {
    setFilters({
      search: "",
      status: null,
      agentId: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <div className="relative">
        <Input
          placeholder="Filter by title"
          className="h-9 bg-white w-50 pl-7 text-sm focus-visible:border-input focus-visible:ring-transparent"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value, page: DEFAULT_PAGE })}
        />
        <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
      <StatusFilter />
      <AgentIdFilter />
      {isAnyFilterModified && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          <XCircleIcon />
          Clear
        </Button>
      )}
    </div>
  );
};
