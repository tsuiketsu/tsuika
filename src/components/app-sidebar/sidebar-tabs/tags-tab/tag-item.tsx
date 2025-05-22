import Deletetag from "@/components/forms/tag/delete-tag";
import UpdateTag from "@/components/forms/tag/update-tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Tag } from "@/types/tag";
import { getTextColor } from "@/utils";
import { useNavigate } from "@tanstack/react-router";
import { Hash, MoreVertical } from "lucide-react";
import { useRef } from "react";

const TagItem = ({ tag }: { tag: Tag }) => {
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
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
    <>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreVertical />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onClick={() => editButtonRef.current?.click()}>
              <span>Edit Tag</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteButtonRef.current?.click()}>
              <span>Delete Tag</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <UpdateTag tag={tag} ref={editButtonRef} />
      <Deletetag id={tag.id} ref={deleteButtonRef} />
    </>
  );
};

export default TagItem;
