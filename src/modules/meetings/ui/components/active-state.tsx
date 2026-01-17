import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

type ActiveStateProps = {
  meetingId: string;
};

export const ActiveState = ({
  meetingId,
}: ActiveStateProps) => {
  return (
    <div className="bg-background rounded-md shadow-sm w-full p-4 flex flex-col items-center gap-y-5">
      <EmptyState
        image="/upcoming.svg"
        title="Meeting is active"
        description="Meeting will end once all participants have left"
      />
      <Button asChild className="w-full lg:w-auto">
        <Link href={`/call/${meetingId}`}>
          <VideoIcon />
          Join meeting
        </Link>
      </Button>
    </div>
  );
};
