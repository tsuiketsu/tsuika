import Deletetag from "../forms/tag/delete-tag";
import UpdateTag from "../forms/tag/update-tag";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import type { Tag } from "@/types/tag";
import { Ellipsis } from "lucide-react";
import React, { Fragment, useRef } from "react";

interface PropsType {
  tag: Tag;
  triggerButton?: React.ReactNode;
}

const TagMenu = ({ tag, triggerButton }: PropsType) => {
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
            <span>Edit Tag</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteButtonRef.current?.click()}>
            <span>Delete Tag</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateTag tag={tag} ref={editButtonRef} />
      <Deletetag id={tag.id} ref={deleteButtonRef} />
    </Fragment>
  );
};

export default TagMenu;
