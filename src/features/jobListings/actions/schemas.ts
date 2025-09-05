import { z } from "zod";

import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";

export const jobListngSchema = z
  .object({
    title: z.string().min(1, "Required"),
    description: z.string().min(1),
    experienceLevel: z.enum(experienceLevels),
    locationRequirements: z.enum(locationRequirements),
    type: z.enum(jobListingTypes),
    wage: z.number().int().positive().min(1).nullable(),
    wageInterval: z.enum(wageIntervals).nullable(),
    stateAbbreviation: z
      .string()
      .transform((val) => (val.trim() === "" ? null : val))
      .nullable(),
    city: z
      .string()
      .transform((val) => (val.trim() === "" ? null : val))
      .nullable(),
  })
  .refine(
    (listing) => {
      return listing.locationRequirements === "remote" || listing.city != null;
    },
    {
      error: "Required for non-remote listings",
      path: ["city"],
    }
  )
  .refine(
    (listing) => {
      return (
        listing.locationRequirements === "remote" ||
        listing.stateAbbreviation != null
      );
    },
    {
      error: "Required for non-remote listings",
      path: ["stateAbbreviation"],
    }
  );
