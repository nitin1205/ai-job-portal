"use server";

import { z } from "zod/v4";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { jobListingAiSearchSchema, jobListingSchema } from "./schemas";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";
import {
  deleteJobListing as deleteJobListingDb,
  insertJobListing,
  updateJobListing as updateJobListingDb,
} from "../db/jobListings";
import {
  getJobListingGlobalTag,
  getJobListingIdTag,
} from "../db/cache/jobListings";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { hasOrgUserPermission } from "@/services/clerk/lib/OrgUserPermissions";
import { getNextJobListingStatus } from "../lib/utils";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/planFeatureHelpers";
import { getMatchingJobListings } from "@/services/inngest/ai-agent/getMatchingJobListings";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null || !(await hasOrgUserPermission("job_listings:create"))) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listings/${jobListing.id}`);
}

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null || !(await hasOrgUserPermission("job_listings:update"))) {
    return {
      error: true,
      message: "You don't have permission to update this job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const updatedJobListing = await updateJobListingDb(id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
}

async function getJobListing(jobListingId: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(jobListingId));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, jobListingId),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}

export async function toggleJobListingStatus(jobListingId: string) {
  const { orgId } = await getCurrentOrganization();
  const error = {
    error: true,
    message: "You don't have permission to update this job listing's status",
  };

  if (orgId == null) return error;

  const jobListing = await getJobListing(jobListingId, orgId);
  if (jobListing == null) {
    return error;
  }

  const newStatus = getNextJobListingStatus(jobListing.status);

  if (
    !(await hasOrgUserPermission("job_listings:change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDb(jobListingId, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
  });

  return {
    error: false,
  };
}

export async function toggleJobListingFeatured(jobListingId: string) {
  const { orgId } = await getCurrentOrganization();
  const error = {
    error: true,
    message:
      "You don't have permission to update this job listing's featured status",
  };

  if (orgId == null) return error;

  const jobListing = await getJobListing(jobListingId, orgId);
  if (jobListing == null) {
    return error;
  }

  const newFeaturedStatus = !jobListing.isFeatured;

  if (
    !(await hasOrgUserPermission("job_listings:change_status")) ||
    (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDb(jobListingId, {
    isFeatured: newFeaturedStatus,
  });

  return {
    error: false,
  };
}

export async function deleteJobListing(jobListingId: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  };

  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return error;

  const jobListing = await getJobListing(jobListingId, orgId);
  if (jobListing == null) return error;

  if (!(await hasOrgUserPermission("job_listings:delete"))) {
    return error;
  }

  await deleteJobListingDb(jobListingId);

  redirect("/employer");
}

export async function getAiJobListingSearchResults(
  unsafeData: z.infer<typeof jobListingAiSearchSchema>
): Promise<
  { error: true; message: string } | { error: false; jobIds: string[] }
> {
  const { success, data } = jobListingAiSearchSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error processing your search query",
    };
  }

  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You need an account to use AI job search",
    };
  }

  const allListings = await getPublicJobListings();
  const matchedListings = await getMatchingJobListings(
    data.query,
    allListings,
    {
      maxNumberOfJobs: 10,
    }
  );

  if (matchedListings.length === 0) {
    return {
      error: true,
      message: "No job match your search criteria",
    };
  }

  return { error: false, jobIds: matchedListings };
}

async function getPublicJobListings() {
  "use cache";
  cacheTag(getJobListingGlobalTag());

  return db.query.JobListingTable.findMany({
    where: eq(JobListingTable.status, "published"),
  });
}
