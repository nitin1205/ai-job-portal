import { serve } from "inngest/next";

import { inngest } from "@/services/inngest/client";
import {
  clerkCreateOrganization,
  clerkCreateOrganizationMembership,
  clerkCreateUser,
  clerkDeleteOrganization,
  clerkDeleteOrganizationMembership,
  clerkDeleteUser,
  clerkUpdateOrganization,
  clerkUpdateUser,
} from "@/services/inngest/functions/clerk";
import { createAISummaryOfUploadedResume } from "@/services/inngest/functions/resume";
import { rankApplication } from "@/services/inngest/functions/jobListingApplication";
import {
  prepareDailyOrganizationUserApplicationNotifications,
  prepareDailyUserJobListingNotifications,
  sendDailyOrganizationUserApplication,
  sendDailyUserJobListingEmail,
} from "@/services/inngest/functions/email";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkDeleteUser,
    clerkUpdateUser,
    clerkCreateOrganization,
    clerkUpdateOrganization,
    clerkDeleteOrganization,
    clerkCreateOrganizationMembership,
    clerkDeleteOrganizationMembership,
    createAISummaryOfUploadedResume,
    rankApplication,
    prepareDailyUserJobListingNotifications,
    sendDailyUserJobListingEmail,
    prepareDailyOrganizationUserApplicationNotifications,
    sendDailyOrganizationUserApplication,
  ],
});
