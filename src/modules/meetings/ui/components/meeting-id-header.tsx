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
import type { MeetingGetOneOutput } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MeetingUpdateDialog } from "./meeting-update-dialog";
import { useConfirm } from "@/hooks/use-confirm";

export const MeetingIdHeader = ({
  meeting,
}: {
  meeting: MeetingGetOneOutput;
}) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters] = useMeetingsFilters();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const remove = useMutation(
    trpc.meetings.remove.mutationOptions({
      // todo: invalidate more stuff
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({
            page: filters.page,
            search: filters.search,
            status: filters.status,
            agentId: filters.agentId,
          }),
        );
        queryClient.invalidateQueries(
          trpc.meetings.getOne.queryOptions({
            id: meeting.id,
          }),
        );
        toast.success("Meeting deleted successfully!");
        router.push("/meetings");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `Are you sure you want to delete this meeting? This will remove all info related to this meeting and cannot be undone.`,
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await remove.mutateAsync({ id: meeting.id });
  };

  return (
    <>
      <RemoveConfirmation />
      <MeetingUpdateDialog
        meeting={meeting}
        open={isUpdateDialogOpen}
        openChange={setIsUpdateDialogOpen}
      />
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/meetings" className="text-lg">
                  My Meetings
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-black" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-lg font-medium">
                {meeting.title}
              </BreadcrumbPage>
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
              <DropdownMenuItem
                onClick={handleRemoveMeeting}
              >
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
