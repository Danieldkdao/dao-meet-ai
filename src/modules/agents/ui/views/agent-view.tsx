"use client";

import { useTRPC } from "@/trpc/client";
import { CreateAgentFormModal } from "../components/create-agent-form-modal";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({}));
  return (
    <div className="w-full h-svh p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-medium">My Agents</h1>
        <CreateAgentFormModal />
      </div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};
