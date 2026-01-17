import { EmptyState } from "@/components/empty-state";

export const CancelledState = () => {
  return (
    <div className="bg-background rounded-md shadow-sm w-full p-4 flex flex-col items-center gap-y-5">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting cancelled"
        description="This meeting was cancelled"
      />
    </div>
  );
};
