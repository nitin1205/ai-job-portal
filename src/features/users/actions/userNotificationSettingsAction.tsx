"use server";

import { z } from "zod/v4";

import { UserNotificationSettingsTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { userNotificationSettingsSchema } from "./schemas";
import { updateUserNotificationSettings as updateUserNotificationSettingsDb } from "../db/userNotificationSettings";

export async function updateUserNotificationSettings(
  unsafeData: z.infer<typeof UserNotificationSettingsTable>
) {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You must be signed in to update notification settings",
    };
  }

  const { success, data } =
    userNotificationSettingsSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your notification settings",
    };
  }

  await updateUserNotificationSettingsDb(userId, data);

  return {
    error: false,
    message: "Successfully updated your notification settings",
  };
}
