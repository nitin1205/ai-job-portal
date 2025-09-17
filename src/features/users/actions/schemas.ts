import { z } from "zod/v4";

export const userNotificationSettingsSchema = z.object({
  newJobEmailNotifications: z.boolean(),
  aiPrompt: z
    .string()
    .transform((val) => (val.trim() === "" ? null : val))
    .nullable(),
});
