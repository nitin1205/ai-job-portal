import { pgTable, varchar } from "drizzle-orm/pg-core";
import { timeStamps } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { JobListingTable } from "./jobListing";
import { OrganizationUserSettingsTable } from "./organizationUserSettings";

export const OrganizationTable = pgTable("organizations", {
  id: varchar().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  imageUrl: varchar(),
  ...timeStamps,
});

export const organizationRelations = relations(
  OrganizationTable,
  ({ many }) => ({
    jobListings: many(JobListingTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
  })
);
