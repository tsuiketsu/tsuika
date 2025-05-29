import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { Tag } from "@/types/tag";
import { Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";

const TagItem = ({ tag }: { tag: Tag }) => {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuButton className="[&.active]:bg-secondary pl-1" asChild>
        <Link to="/bookmarks/$slug" params={{ slug: `tag/${tag.id}` }}>
          <Hash size={14} style={{ color: tag.color }} />
          <span>{tag.name} </span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge>{tag.useCount}</SidebarMenuBadge>
    </SidebarMenuSubItem>
  );
};

export default TagItem;
