import { EmptyState } from "@/components/empty-state";

export const ProcessingState = () => {
  return (
    <div className="bg-background rounded-md shadow-sm w-full p-4 flex flex-col items-center gap-y-5">
      <EmptyState
        image="/processing.svg"
        title="Meeting completed"
        description="This meeting was completed, a summary will appear soon"
      />
    </div>
  );
};
