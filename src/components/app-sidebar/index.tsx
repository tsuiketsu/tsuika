import { Sidebar } from "@/components/ui/sidebar";
import SidebarTabs from "./sidebar-tabs";
import UserProfile from "./user-profile";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarTabs />
      <UserProfile />
    </Sidebar>
  );
}
