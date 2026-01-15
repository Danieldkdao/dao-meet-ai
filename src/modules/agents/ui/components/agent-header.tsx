import { CreateAgentFormModal } from "./create-agent-form-modal";

export const AgentHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-medium">My Agents</h1>
      <CreateAgentFormModal />
    </div>
  );
};
