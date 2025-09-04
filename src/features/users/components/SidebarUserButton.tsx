import { Suspense } from "react";

import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { SignOutButton } from "@/services/clerk/components/AuthButtons";

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserButtonSuspense />
    </Suspense>
  );
}

async function SidebarUserButtonSuspense() {
  const { user } = await getCurrentUser({ allData: true });

  if (user == null) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }

  return <SidebarUserButtonClient user={user} />;
}
