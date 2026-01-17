"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdHeader } from "../components/meeting-id-header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BanIcon, LoaderIcon } from "lucide-react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

export const MeetingIdView = ({ meetingId }: { meetingId: string }) => {
  const trpc = useTRPC();
  const { data: meeting } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const isActive = meeting.status === "active";
  const isUpcoming = meeting.status === "upcoming";
  const isCancelled = meeting.status === "cancelled";
  const isCompleted = meeting.status === "completed";
  const isProcessing = meeting.status === "processing";

  return (
    <div className="flex flex-col gap-y-4">
      <MeetingIdHeader meeting={meeting} />
      {isCancelled && <CancelledState />}
      {isProcessing && <ProcessingState />}
      {isCompleted && <div>Completed</div>}
      {isActive && <ActiveState meetingId={meeting.id} />}
      {isUpcoming && (
        <UpcomingState
          meetingId={meeting.id}
          onCancelMeeting={() => {}}
          isCancelling={false}
        />
      )}
    </div>
  );
};

export const MeetingIdLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds"
    />
  );
};

export const MeetingIdError = () => {
  return (
    <ErrorState
      title="Error loading meeting"
      description="Please try again later."
    />
  );
};
