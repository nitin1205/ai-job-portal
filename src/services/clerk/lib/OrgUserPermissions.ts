import { auth } from "@clerk/nextjs/server";

type UserPermission =
  | "job_listings:create"
  | "job_listings:update"
  | "job_listings:delete"
  | "job_listings:change_status"
  | "job_listing_applications:change_rating"
  | "job_listing_applications:change_stage";

export async function hasOrgUserPermission(permission: UserPermission) {
  const { has } = await auth();
  return has({ permission });
}
