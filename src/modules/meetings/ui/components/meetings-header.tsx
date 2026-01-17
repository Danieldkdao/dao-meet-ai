import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const MeetingsHeader = () => {
  // todo: add filters, create meeting functionality
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-medium">My Meetings</h1>
        <Button>
          <PlusIcon />
          New Meeting
        </Button>
      </div>
    </div>
  );
};
