import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

export const AgentTable = pgTable("agents", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar().notNull(),
  instructions: varchar().notNull(),
  creatorId: varchar()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const agentRelations = relations(AgentTable, ({ one }) => ({
  user: one(user, {
    fields: [AgentTable.creatorId],
    references: [user.id],
  }),
}));
