import {
  ExperienceLevel,
  JobListingStatus,
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

export function formatJobListingStatus(jobStatus: JobListingStatus) {
  switch (jobStatus) {
    case "draft":
      return "Draft";
    case "delisted":
      return "Delisted";
    case "published":
      return "Active";
  }
}

export function formatWage(wage: number, wageInterval: WageInterval) {
  const wageFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  switch (wageInterval) {
    case "hourly":
      return `${wageFormatter.format(wage)} / hour`;
    case "yearly":
      return `${wageFormatter.format(wage)} / year`;
    case "monthly":
      return `${wageFormatter.format(wage)} / month`;
    case "weekly":
      return `${wageFormatter.format(wage)} / week`;
    default:
      throw new Error(`Unknown wage interval: ${wageInterval satisfies never}`);
  }
}

export function formatJobListingLocation({
  stateAbbreviation,
  city,
}: {
  stateAbbreviation: string | null;
  city: string | null;
}) {
  if (stateAbbreviation == null && city == null) return "none";

  const locationParts = [];
  if (city != null) locationParts.push(city);
  if (stateAbbreviation != null) {
    locationParts.push(stateAbbreviation.toUpperCase());
  }

  return locationParts.join(", ");
}
