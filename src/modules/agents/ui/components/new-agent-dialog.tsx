import { GeneratedAvatar } from "@/components/generated-avatar";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useTRPC } from "@/trpc/client";
import { type Dispatch, type SetStateAction } from "react";
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
import { PlusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const newAgentDialogSchema = z.object({
  name: z
    .string({ error: "Invalid name" })
    .trim()
    .min(1, { error: "Name must be at least 1 character" }),
  instructions: z
    .string({ error: "Invalid instructions" })
    .trim()
    .min(1, { error: "Description must be at least 1 character" }),
});

type FormData = z.infer<typeof newAgentDialogSchema>;

type NewAgentDialogProps = {
  open: boolean;
  openChange: Dispatch<SetStateAction<boolean>>;
};

export const NewAgentDialog = ({ open, openChange }: NewAgentDialogProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(newAgentDialogSchema),
    defaultValues: {
      name: "",
      instructions: "",
    },
  });
  const name = form.watch("name");
  const create = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        // todo: invalidate some other stuff
        toast.success("Agent created successfully!");
        openChange(false);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  const handleSubmit = (data: FormData) => {
    create.mutate({ ...data });
  };

  return (
    <>
      <Button onClick={() => openChange(true)}>
        <PlusIcon />
        New Agent
      </Button>
      <ResponsiveDialog
        title="New Agent"
        description="Create a new agent"
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
