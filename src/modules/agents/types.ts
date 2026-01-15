import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type AgentsGetManyOutput =
  inferRouterOutputs<AppRouter>["agents"]["getMany"];
