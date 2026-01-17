import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import type { AgentsGetOneOutput } from "../../types";
import { toast } from "sonner";
import { type Dispatch, type SetStateAction } from "react";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const updateAgentDialogSchema = z.object({
  name: z
    .string({ error: "Invalid name" })
    .trim()
    .min(1, { error: "Name must be at least 1 character" }),
  instructions: z
    .string({ error: "Invalid instructions" })
    .trim()
    .min(1, { error: "Description must be at least 1 character" }),
});

type FormData = z.infer<typeof updateAgentDialogSchema>;

type AgentUpdateDialogProps = {
  agent: AgentsGetOneOutput;
  open: boolean;
  openChange: Dispatch<SetStateAction<boolean>>;
};

export const AgentUpdateDialog = ({
  agent,
  open,
  openChange,
}: AgentUpdateDialogProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [filters] = useAgentsFilters();
  const form = useForm<FormData>({
    resolver: zodResolver(updateAgentDialogSchema),
    defaultValues: {
      name: agent.name,
      instructions: agent.instructions,
    },
  });
  const name = form.watch("name");

  const edit = useMutation(
    // todo: invalidate some other stuff
    trpc.agents.edit.mutationOptions({
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
        toast.success("Agent updated successfully!");
        openChange(false);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const handleSubmit = (data: FormData) => {
    if (
      data.name.trim() === agent.name &&
      data.instructions.trim() === agent.instructions
    ) {
      return toast.error("No changes made");
    }
    edit.mutate({ id: agent.id, ...data });
  };

  return (
    <ResponsiveDialog
      title="Update Agent"
      description="Edit agent details"
      open={open}
      onOpenChange={openChange}
    >
      <GeneratedAvatar
        seed={name}
        className="size-16"
        variant="botttsNeutral"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter agent name"
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="You are a helpful assistant that can answer questions and help with tasks."
                    className="max-h-32 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-between">
            <Button
              variant="ghost"
              type="button"
              disabled={edit.isPending}
              onClick={() => openChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={edit.isPending}>Update</Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
};
