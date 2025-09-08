import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { revalidateJobListingCache } from "./cache/jobListings";
import { eq } from "drizzle-orm";

export async function insertJobListing(
  jobListing: typeof JobListingTable.$inferInsert
) {
  const [newListing] = await db
    .insert(JobListingTable)
    .values(jobListing)
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache(newListing);

  return newListing;
}

export async function updateJobListing(
  jobListingId: string,
  jobListing: Partial<typeof JobListingTable.$inferInsert>
) {
  const [updatedJobListing] = await db
    .update(JobListingTable)
    .set(jobListing)
    .where(eq(JobListingTable.id, jobListingId))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache(updatedJobListing);

  return updatedJobListing;
}

export async function deleteJobListing(jobListingId: string) {
  const [deletedJobListing] = await db
    .delete(JobListingTable)
    .where(eq(JobListingTable.id, jobListingId))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache(deletedJobListing);
  return deletedJobListing;
}
