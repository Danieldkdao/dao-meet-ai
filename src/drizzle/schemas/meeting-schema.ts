import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { AgentTable } from "./agent-schema";
import { relations } from "drizzle-orm";

export const meetingStatuses = [
  "upcoming",
  "active",
  "completed",
  "processing",
  "cancelled",
] as const;
export type MeetingStatusesType = (typeof meetingStatuses)[number];
export const meetingStatusEnum = pgEnum("meetingStatus", meetingStatuses);

export const MeetingTable = pgTable("meetings", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  creatorId: varchar()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  agentId: uuid()
    .references(() => AgentTable.id, { onDelete: "cascade" })
    .notNull(),
  status: meetingStatusEnum().notNull().default("upcoming"),
  transcriptUrl: varchar(),
  recordingUrl: varchar(),
  summary: varchar(),
  startedAt: timestamp({ withTimezone: true }),
  endedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const meetingRelations = relations(MeetingTable, ({ one }) => ({
  creator: one(user, {
    fields: [MeetingTable.creatorId],
    references: [user.id],
  }),
  agent: one(AgentTable, {
    fields: [MeetingTable.agentId],
    references: [AgentTable.id],
  }),
}));
