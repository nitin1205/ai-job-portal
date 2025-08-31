import { pgTable, varchar } from "drizzle-orm/pg-core";
import { timeStamps } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { UserNotificationSettingsTable } from "./userNotificationSettings";
import { UserResumeTable } from "./userResume";
import { OrganizationUserSettingsTable } from "./organizationUserSettings";

export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  imageUrl: varchar().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  ...timeStamps,
});

export const userRelations = relations(UserTable, ({ one, many }) => ({
  notificationSettings: one(UserNotificationSettingsTable),
  resume: one(UserResumeTable),
  organizationUserSettings: many(OrganizationUserSettingsTable),
}));
