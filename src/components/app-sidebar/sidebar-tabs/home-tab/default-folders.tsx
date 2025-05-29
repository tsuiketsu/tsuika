import { defaultFolders } from "./constants";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export default function DefaultFolders() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {defaultFolders.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  to="/bookmarks/$slug"
                  params={{
                    slug: `folder/${item.url}`,
                  }}
                  className="[&.active]:bg-secondary active:scale-97"
                >
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
