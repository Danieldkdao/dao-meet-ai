import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

export type MeetingGetManyOutput =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"];
export type MeetingGetOneOutput =
  inferRouterOutputs<AppRouter>["meetings"]["getOne"];
