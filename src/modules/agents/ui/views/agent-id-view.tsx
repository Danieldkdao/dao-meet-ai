"use client";

import { ErrorState } from "@/components/error-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdHeader } from "../components/agent-id-header";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";

export const AgentIdView = ({ agentId }: { agentId: string }) => {
  const trpc = useTRPC();
  const { data: agent } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  return (
    <div className="flex flex-col gap-y-4">
      <AgentIdHeader agent={agent} />
      <div className="bg-background rounded-md w-full p-4 flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            seed={agent.name}
            variant="botttsNeutral"
            className="size-8"
          />
          <h1 className="text-xl">{agent.name}</h1>
        </div>
        <Badge variant="outline">
          <VideoIcon className="text-blue-500 size-10" />
          <span>
            {agent.meetingCount}{" "}
            {agent.meetingCount === 1 ? "meeting" : "meetings"}
          </span>
        </Badge>
        <h2 className="text-lg">Instructions</h2>
        <p className="text-muted-foreground">{agent.instructions}</p>
      </div>
    </div>
  );
};

export const AgentIdLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds"
    />
  );
};

export const AgentIdError = () => {
  return (
    <ErrorState
      title="Error loading agent"
      description="Please try again later."
    />
  );
};
