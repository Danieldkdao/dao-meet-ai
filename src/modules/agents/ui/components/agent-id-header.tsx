import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import type { AgentsGetOneOutput } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { toast } from "sonner";
import { useState } from "react";
import { AgentUpdateDialog } from "./agent-update-dialog";
import { useRouter } from "next/navigation";

export const AgentIdHeader = ({ agent }: { agent: AgentsGetOneOutput }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters] = useAgentsFilters();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const remove = useMutation(
    trpc.agents.remove.mutationOptions({
      // todo: invalidate more stuff
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({
            page: filters.page,
            search: filters.search,
          }),
        );
        queryClient.invalidateQueries(
          trpc.agents.getOne.queryOptions({
            id: agent.id,
          }),
        );
        toast.success("Agent deleted successfully!");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const onRemove = () => {
    remove.mutate({ id: agent.id });
    router.push("/agents");
  };

  return (
    <>
      <AgentUpdateDialog
        agent={agent}
        open={isUpdateDialogOpen}
        openChange={setIsUpdateDialogOpen}
      />
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/agents" className="text-lg">
                  My Agents
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-black" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-lg">{agent.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
                <EditIcon className="text-black" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRemove}>
                <TrashIcon className="text-black" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
