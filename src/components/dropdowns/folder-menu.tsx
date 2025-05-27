import DeleteFolder from "../forms/folder/delete-folder";
import UpdateFolder from "../forms/folder/update-folder";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import type { Folder } from "@/types/folder";
import { Ellipsis } from "lucide-react";
import React, { Fragment, useRef } from "react";

interface PropsType {
  folder: Folder;
  triggerButton?: React.ReactNode;
}

const FolderMenu = ({ folder, triggerButton }: PropsType) => {
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {triggerButton ?? (
            <Button variant="ghost" size="icon" className="size-8">
              <Ellipsis size={20} />
            </Button>
          )}
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
      <UpdateFolder folder={folder} ref={editButtonRef} />
      <DeleteFolder id={folder.id} ref={deleteButtonRef} />
    </Fragment>
  );
};

export default FolderMenu;
