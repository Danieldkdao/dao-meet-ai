"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingsFilters } from "./meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingsHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog open={open} openChange={setOpen} />
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-medium">My Meetings</h1>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
          <MeetingsFilters />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
