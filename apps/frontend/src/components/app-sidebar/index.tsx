import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import GeneralSection from "./sections/general";
import UserProfile from "./user-profile";

export function AppSidebar() {
  return (
    <Sidebar variant="floating" className="select-none">
      <SidebarContent>
        <GeneralSection />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserProfile />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
