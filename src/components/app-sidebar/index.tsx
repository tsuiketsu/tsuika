import GeneralSection from "./sections/general";
import UserProfile from "./user-profile";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon" className="select-none">
      <SidebarContent>
        <GeneralSection />
      </SidebarContent>
      <UserProfile />
    </Sidebar>
  );
}
