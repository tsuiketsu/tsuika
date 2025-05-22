import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Archive, Inbox, Star } from "lucide-react";

const items = [
  {
    title: "Favorites",
    url: "favorites",
    icon: Star,
  },
  {
    title: "Unsorted",
    url: "unsorted",
    icon: Inbox,
  },
  {
    title: "Archived",
    url: "archived",
    icon: Archive,
  },
];

export default function DefaultFolders() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  to="/dashboard/bookmarks/$slug"
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
