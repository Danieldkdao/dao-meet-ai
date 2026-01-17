import {
  DEFAULT_PAGE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  PAGE_SIZE,
} from "@/constants";
import { db } from "@/drizzle/db";
import { AgentTable, MeetingTable, user } from "@/drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import z from "zod";
import { meetingStatuses } from "@/drizzle/schemas/meeting-schema";

export const meetingsRouter = createTRPCRouter({
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
        status: z.enum([...meetingStatuses, ""]).nullish(),
        agentId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.auth.user;
      const { page, pageSize, search, status, agentId } = input;
      const safePage = Math.max(1, page);
      const offset = (safePage - 1) * pageSize;

      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!existingUser) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }

      const meetings = await db
        .select({
          ...getTableColumns(MeetingTable),
          agent: AgentTable,
          duration:
            sql<number>`EXTRACT(EPOCH FROM (${MeetingTable.endedAt} - ${MeetingTable.startedAt}))`.as(
              "duration",
            ),
        })
        .from(MeetingTable)
        .where(
          and(
            eq(MeetingTable.creatorId, existingUser.id),
            status ? eq(MeetingTable.status, status) : undefined,
            agentId ? eq(MeetingTable.agentId, agentId) : undefined,
            search ? ilike(MeetingTable.title, `%${search}%`) : undefined,
          ),
        )
        .innerJoin(AgentTable, eq(MeetingTable.agentId, AgentTable.id))
        .limit(pageSize)
        .offset(offset)
        .orderBy(desc(MeetingTable.updatedAt), desc(MeetingTable.id));

      const [total] = await db
        .select({
          count: count(),
        })
        .from(MeetingTable)
        .innerJoin(AgentTable, eq(MeetingTable.agentId, AgentTable.id))
        .where(
          and(
            eq(MeetingTable.creatorId, existingUser.id),
            status ? eq(MeetingTable.status, status) : undefined,
            agentId ? eq(MeetingTable.agentId, agentId) : undefined,
            search ? ilike(MeetingTable.title, `%${search}%`) : undefined,
          ),  
        );

      const hasNextPage = (page * pageSize) < total.count;
      const hasPreviousPage = page > 1;
      const totalPages = Math.floor(total.count / pageSize) || 1;

      return {
        meetings,
        metadata: {
          hasNextPage,
          hasPreviousPage,
          totalPages,
        },
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        agentId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.auth.user;
      const { title, agentId } = input;

      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!existingUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const [createdMeeting] = await db
        .insert(MeetingTable)
        .values({
          title,
          creatorId: existingUser.id,
          agentId,
        })
        .returning();

      return createdMeeting;
    }),
});
