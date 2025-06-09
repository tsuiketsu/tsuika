import GeneralSection from "./sections/general";
import UserProfile from "./user-profile";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar variant="floating" className="select-none">
      <SidebarContent>
        <GeneralSection />
      </SidebarContent>
      <UserProfile />
    </Sidebar>
  );
}
