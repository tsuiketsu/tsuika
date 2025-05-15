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
    url: "#",
    icon: Star,
  },
  {
    title: "Unsorted",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Archived",
    url: "#",
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
                <Link to={item.url}>
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
