import GeneralSection from "./sections/general";
import UserProfile from "./user-profile";
import {
  Sidebar,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenu,
  SidebarFooter,
} from "@/components/ui/sidebar";

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
