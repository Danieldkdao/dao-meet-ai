"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

export const CallView = ({ meetingId }: { meetingId: string }) => {
  const trpc = useTRPC();
  const { data: meeting } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  if (meeting.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="Meeting has ended"
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  return <CallProvider meetingId={meeting.id} meetingTitle={meeting.title} />;
};

export const CallViewLoading = () => {
  return (
    <LoadingState
      title="Preparing call"
      description="This may take a few seconds"
    />
  );
};

export const CallViewError = () => {
  return (
    <ErrorState
      title="Error preparing call"
      description="Please try again later"
    />
  );
};
