import {
  DEFAULT_PAGE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  PAGE_SIZE,
} from "@/constants";
import { db } from "@/drizzle/db";
import { AgentTable, user } from "@/drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import z from "zod";

export const agentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        instructions: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.auth.user;
      const { name, instructions } = input;

      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!existingUser) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }

      // todo: add check for permissions

      const [createdAgent] = await db
        .insert(AgentTable)
        .values({
          name,
          instructions,
          creatorId: userId,
        })
        .returning();

      return createdAgent;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.auth.user;
      const { page, pageSize, search } = input;
      const safePage = Math.max(1, page);
      const offset = (safePage - 1) * pageSize;

      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!existingUser) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }

      const agents = await db
        .select({
          ...getTableColumns(AgentTable),
          meetingCount: sql<number>`5`,
          // add number of meetings per
        })
        .from(AgentTable)
        .where(
          and(
            eq(AgentTable.creatorId, existingUser.id),
            search ? ilike(AgentTable.name, `%${search}%`) : undefined
          )
        )
        .limit(pageSize)
        .offset(offset)
        .orderBy(desc(AgentTable.updatedAt), desc(AgentTable.id));

      const [total] = await db
        .select({
          count: count(),
        })
        .from(AgentTable)
        .where(
          and(
            eq(AgentTable.creatorId, existingUser.id),
            search ? ilike(AgentTable.name, `%${search}%`) : undefined
          )
        );

      const hasNextPage = agents.length === pageSize;
      const hasPreviousPage = page > 1;
      const totalPages = Math.floor(total.count / pageSize) || 1;

      return {
        agents,
        metadata: {
          hasNextPage,
          hasPreviousPage,
          totalPages,
        },
      };
    }),
});
