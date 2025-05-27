import SidebarTabs from "./sidebar-tabs";
import UserProfile from "./user-profile";
import { Sidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar className="select-none">
      <SidebarTabs />
      <UserProfile />
    </Sidebar>
  );
}
