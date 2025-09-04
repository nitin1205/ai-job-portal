import { Suspense } from "react";

import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { SignOutButton } from "@/services/clerk/components/AuthButtons";

export function SidebarOrganizationButton() {
  return (
    <Suspense>
      <SidebarOrganizationButtonSuspense />
    </Suspense>
  );
}

async function SidebarOrganizationButtonSuspense() {
  const [{ user }, { organization }] = await Promise.all([
    getCurrentUser({ allData: true }),
    getCurrentOrganization({ allData: true }),
  ]);

  if (user == null || organization == null) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }

  return (
    <SidebarOrganizationButtonClient user={user} organization={organization} />
  );
}
