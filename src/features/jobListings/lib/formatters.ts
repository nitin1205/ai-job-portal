import {
  ExperienceLevel,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/drizzle/schema";

export function formatWageInterval(interval: WageInterval) {
  switch (interval) {
    case "hourly":
      return "Hour";
    case "yearly":
      return "Year";
    case "weekly":
      return "Week";
    case "monthly":
      return "Month";
    default:
      throw new Error(`Invalid wage interval: ${interval satisfies never}`);
  }
}

export function formatLocationRequirement(
  locationRequirement: LocationRequirement
) {
  switch (locationRequirement) {
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    case "in-office":
      return "In Office";
    default:
      throw new Error(
        `Unknown location requirement: ${locationRequirement satisfies never}`
      );
  }
}

export function formatExperienceLevel(experienceLevel: ExperienceLevel) {
  switch (experienceLevel) {
    case "junior":
      return "Junior";
    case "mid-level":
      return "Mid Level";
    case "senior":
      return "senior";
    default:
      throw new Error(
        `Unknown experience level: ${experienceLevel satisfies never}`
      );
  }
}

export function formatJobType(type: JobListingType) {
  switch (type) {
    case "full-time":
      return "Full Time";
    case "intership":
      return "Intership";
    case "part-time":
      return "Part Time";
    default:
      throw new Error(`Unknown job type: ${type satisfies never}`);
  }
}
