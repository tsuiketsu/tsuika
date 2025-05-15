import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";

const items = [
  { title: "linux", url: "#", count: 28, color: "#fbbf24" },
  { title: "anime", url: "#", count: 10, color: "#16a34a" },
  { title: "typescript", url: "#", count: 36, color: "#8b5cf6" },
];

export default function TagsTab() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url} className="inline-flex justify-between">
                  <div className="inline-flex items-center gap-1.5">
                    <Hash color={item.color} size={16} />
                    <span>{item.title}</span>
                  </div>
                  <span>{item.count}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
