import { GeneratedAvatar } from "@/components/generated-avatar";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useTRPC } from "@/trpc/client";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CommandSelect } from "@/components/command-select";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

const newMeetingDialogSchema = z.object({
  title: z
    .string({ error: "Invalid name" })
    .trim()
    .min(1, { error: "Name must be at least 1 character" }),
  agentId: z
    .string({ error: "Invalid agent" })
    .trim()
    .min(1, { error: "Please select an agent" }),
});

type FormData = z.infer<typeof newMeetingDialogSchema>;

type NewMeetingDialogProps = {
  open: boolean;
  openChange: Dispatch<SetStateAction<boolean>>;
};

export const NewMeetingDialog = ({
  open,
  openChange,
}: NewMeetingDialogProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [filters] = useMeetingsFilters();

  const [agentCreateOpen, setAgentCreateOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const form = useForm<FormData>({
    resolver: zodResolver(newMeetingDialogSchema),
    defaultValues: {
      title: "",
      agentId: "",
    },
  });

  const create = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({
            page: filters.page,
            search: filters.search,
            status: filters.status,
            agentId: filters.agentId,
          }),
        );
        // todo: invalidate some other stuff
        toast.success("Meeting created successfully!");
        openChange(false);
        router.push(`/meetings/${data.id}`);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  const handleSubmit = (data: FormData) => {
    create.mutate({ ...data });
  };

  return (
    <>
      <NewAgentDialog open={agentCreateOpen} openChange={setAgentCreateOpen} />
      <ResponsiveDialog
        title="New Meeting"
        description="Create a new meeting"
        open={open}
        onOpenChange={openChange}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Math Consultations"
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="agentId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent</FormLabel>
                  <FormControl>
                    <CommandSelect
                      options={(data?.agents ?? []).map((agent) => ({
                        id: agent.id,
                        value: agent.id,
                        children: (
                          <div className="flex items-center gap-x-2">
                            <GeneratedAvatar
                              seed={agent.name}
                              variant="botttsNeutral"
                              className="border size-6"
                            />
                            <span>{agent.name}</span>
                          </div>
                        ),
                      }))}
                      onSelect={field.onChange}
                      onSearch={setAgentSearch}
                      value={field.value}
                      placeholder="Select an agent"
                    />
                  </FormControl>
                  <FormDescription>
                    Can't find what you're looking for?{" "}
                    <span
                      onClick={() => setAgentCreateOpen(true)}
                      className="text-primary cursor-pointer"
                    >
                      Create a new agent
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-between">
              <Button
                variant="ghost"
                type="button"
                disabled={create.isPending}
                onClick={() => openChange(false)}
              >
                Cancel
              </Button>
              <Button disabled={create.isPending}>Create</Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
};
