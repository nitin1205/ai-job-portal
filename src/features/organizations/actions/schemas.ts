import { z } from "zod/v4";

export const organizationUserSettingsSchema = z.object({
  newApplicationEmailNotifications: z.boolean(),
  minimumRating: z.number().min(1).max(5).nullable(),
});
