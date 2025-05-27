import TagMenu from "@/components/dropdowns/tag-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Tag } from "@/types/tag";
import { getTextColor } from "@/utils";
import { useNavigate } from "@tanstack/react-router";
import { Hash, MoreVertical } from "lucide-react";

const TagItem = ({ tag }: { tag: Tag }) => {
  const navigate = useNavigate();

  const onClick = (tag: string) => (_: React.MouseEvent) => {
    navigate({
      to: "/dashboard/bookmarks/$slug",
      params: {
        slug: `tag/${tag}`,
      },
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="pl-1">
        <div
          className="inline-flex items-center gap-1.5"
          onClick={onClick(tag.name)}
        >
          <span
            className="rounded-sm bg-red-500 p-1"
            style={{
              backgroundColor: tag.color,
            }}
          >
            <Hash color={getTextColor(tag.color)} size={16} />
          </span>
          <span>{tag.name}</span>
          <span className="ml-auto">{tag.useCount}</span>
        </div>
      </SidebarMenuButton>
      <TagMenu
        tag={tag}
        triggerButton={
          <SidebarMenuAction>
            <MoreVertical />
          </SidebarMenuAction>
        }
      />
    </SidebarMenuItem>
  );
};

export default TagItem;
