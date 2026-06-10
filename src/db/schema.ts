import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const todosTable = pgTable("todos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  dueDate: text("due_date"),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull(),
})

export const labUsersTable = pgTable("lab_users", {
  fid: integer("fid").primaryKey(),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  primaryWallet: text("primary_wallet").notNull(),
  circlesProfile: text("circles_profile").notNull(),
  notificationStatus: text("notification_status").notNull(),
})

export const missionCompletionsTable = pgTable("mission_completions", {
  id: text("id").primaryKey(),
  fid: integer("fid").notNull(),
  missionId: text("mission_id").notNull(),
  missionDate: text("mission_date").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  verifiedAt: timestamp("verified_at", {
    mode: "date",
    withTimezone: true,
  })
    .notNull(),
  ticketGranted: integer("ticket_granted").notNull(),
})

export const waifuProfilesTable = pgTable("waifu_profiles", {
  fid: integer("fid").primaryKey(),
  name: text("name").notNull(),
  activeCosmetic: text("active_cosmetic").notNull(),
})
