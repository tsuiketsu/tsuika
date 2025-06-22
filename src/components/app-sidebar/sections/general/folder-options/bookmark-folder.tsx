import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import { FolderIcon, LockIcon } from "lucide-react";
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
      <Tooltip delayDuration={800}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-60">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface BookmarkFolderProps {
  id: string;
  name: string;
  description: string | undefined;
  isLocked: boolean;
}

const BookmarkFolder = ({
  id,
  name,
  description,
  isLocked,
}: BookmarkFolderProps) => {
  return (
    <FolderTooltip
      text={description ?? ""}
      isDisabled={!description || description.trim() === ""}
    >
      <SidebarMenuButton asChild>
        <Link
          to="/bookmarks/$slug"
          className="[&.active]:bg-secondary active:scale-97"
          params={{ slug: `folder/${id}` }}
        >
          {isLocked ? <LockIcon className="text-green-600" /> : <FolderIcon />}
          <span>{name}</span>
        </Link>
      </SidebarMenuButton>
    </FolderTooltip>
  );
};

export default BookmarkFolder;
