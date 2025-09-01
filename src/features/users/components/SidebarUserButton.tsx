import { auth } from "@clerk/nextjs/server";
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";
import { Suspense } from "react";

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserButtonSuspense />
    </Suspense>
  );
}

async function SidebarUserButtonSuspense() {
  const { userId } = await auth();

  return (
    <SidebarUserButtonClient
      user={{ email: "test@example.com", name: "test", imageUrl: "" }}
    />
  );
}
