import DeleteFolder from "@/components/forms/folder/delete-folder";
import UpdateFolder from "@/components/forms/folder/update-folder";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Folder } from "@/types/folder";
import { MoreHorizontal } from "lucide-react";
import React, { useRef } from "react";

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
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <SidebarMenuItem className="relative select-none">
        <FolderTooltip
          text={folder.description}
          isDisabled={!folder.description}
        >
          <SidebarMenuButton asChild>
            <span>{folder.name}</span>
          </SidebarMenuButton>
        </FolderTooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="mr-0.5">
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onClick={() => editButtonRef.current?.click()}>
              <span>Edit Folder</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteButtonRef.current?.click()}>
              <span>Delete Folder</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <UpdateFolder folder={folder} ref={editButtonRef} />
      <DeleteFolder id={folder.id} ref={deleteButtonRef} />
    </>
  );
};

export default BookmarkFolder;
