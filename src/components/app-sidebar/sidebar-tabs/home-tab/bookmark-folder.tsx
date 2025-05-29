import FolderMenu from "@/components/dropdowns/folder-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Folder } from "@/types/folder";
import { Link } from "@tanstack/react-router";
import { Ellipsis } from "lucide-react";
import React from "react";

interface FolderTooltipProps {
  text: string;
  children: React.ReactNode;
  isDisabled: boolean;
}

const FolderTooltip = ({ text, children, isDisabled }: FolderTooltipProps) => {
  if (isDisabled) {
    return children;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-60">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const BookmarkFolder = ({ folder }: { folder: Folder }) => {
  return (
    <SidebarMenuItem className="relative select-none">
      <FolderTooltip text={folder.description} isDisabled={!folder.description}>
        <SidebarMenuButton asChild>
          <Link
            to="/bookmarks/$slug"
            className="[&.active]:bg-secondary active:scale-97"
            params={{ slug: `folder/${folder.id}` }}
          >
            <span>{folder.name}</span>
          </Link>
        </SidebarMenuButton>
      </FolderTooltip>
      <FolderMenu
        folder={folder}
        triggerButton={
          <SidebarMenuAction asChild>
            <Ellipsis size={18} />
          </SidebarMenuAction>
        }
      />
    </SidebarMenuItem>
  );
};

export default BookmarkFolder;
