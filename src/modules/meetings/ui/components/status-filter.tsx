import { CommandSelect } from "@/components/command-select";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { meetingStatuses, type MeetingStatusesType } from "@/drizzle/schema";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";

const options = [
  {
    id: meetingStatuses[0],
    value: meetingStatuses[0],
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon />
        {meetingStatuses[0]}
      </div>
    ),
  },
  {
    id: meetingStatuses[1],
    value: meetingStatuses[1],
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon />
        {meetingStatuses[1]}
      </div>
    ),
  },
  {
    id: meetingStatuses[2],
    value: meetingStatuses[2],
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon />
        {meetingStatuses[2]}
      </div>
    ),
  },
  {
    id: meetingStatuses[3],
    value: meetingStatuses[3],
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon />
        {meetingStatuses[3]}
      </div>
    ),
  },
  {
    id: meetingStatuses[4],
    value: meetingStatuses[4],
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon />
        {meetingStatuses[4]}
      </div>
    ),
  },
];

export const StatusFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <CommandSelect
      placeholder="Status"
      className="h-9"
      options={options}
      onSelect={(value) => setFilters({ status: value as MeetingStatusesType, page: DEFAULT_PAGE })}
      value={filters.status ?? ""}
    />
  );
};
