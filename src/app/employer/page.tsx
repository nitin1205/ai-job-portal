import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { JobListingTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
import { Suspense } from "react";

export default function EmployerHomePage() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return null;

  const jobListings = await getMostRecentJobListing(orgId);

  if (jobListings == null) {
    redirect("/employer/job-listings/new");
  } else {
    redirect(`/employer/job-listings/${jobListings.id}`);
  }
}

async function getMostRecentJobListing(orgId: string) {
  "use cache";

  cacheTag(getJobListingOrganizationTag(orgId));

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}
