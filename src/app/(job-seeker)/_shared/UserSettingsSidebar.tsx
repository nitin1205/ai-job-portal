import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import { BellIcon, FilterIcon } from "lucide-react";

export function UserSettingsSidebar() {
  return (
    <SidebarNavMenuGroup
      items={[
        {
          href: "/user-settings/notifications",
          icon: <BellIcon />,
          label: "Notificatons",
        },
        {
          href: "/user-settings/resume",
          icon: <FilterIcon />,
          label: "Resume",
        },
      ]}
    />
  );
}
