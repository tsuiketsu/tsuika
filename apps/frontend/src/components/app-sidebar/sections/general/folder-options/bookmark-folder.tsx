import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Folder } from "@/types/folder";
import { Link, type LinkProps } from "@tanstack/react-router";
import { FolderIcon, GlobeIcon, LockIcon } from "lucide-react";
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

const BookmarkFolder = ({ folder }: { folder: Folder | undefined }) => {
  if (!folder) return null;

  const { id, name, description, isPublic } = folder;

  const isLocked = !!folder.settings?.keyDerivation;

  const navigation: LinkProps = isLocked
    ? { to: "/bookmarks/folder/s/$id", params: { id } }
    : { to: "/bookmarks/$slug", params: { slug: `folder/${id}` } };

  return (
    <FolderTooltip
      text={description ?? ""}
      isDisabled={!description || description.trim() === ""}
    >
      <SidebarMenuButton asChild>
        <Link
          className="[&.active]:bg-secondary active:scale-97"
          {...navigation}
        >
          {isLocked ? <LockIcon /> : isPublic ? <GlobeIcon /> : <FolderIcon />}
          <span>{name}</span>
        </Link>
      </SidebarMenuButton>
    </FolderTooltip>
  );
};

export default BookmarkFolder;
