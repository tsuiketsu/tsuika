import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";
import { lazy, useRef } from "react";

const InsertFolder = lazy(
  () => import("@/components/forms/folder/insert-folder")
);
const AddBookmark = lazy(
  () => import("@/components/forms/bookmark/insert-bookmark")
);

export default function DropdownOptions() {
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const folderButtonRef = useRef<HTMLButtonElement>(null);

  const onNewLink = () => {
    linkButtonRef.current?.click();
  };

  const onNewFolder = () => {
    folderButtonRef.current?.click();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <PlusCircle />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2.5">
          <DropdownMenuItem onClick={onNewLink}>New Link</DropdownMenuItem>
          <DropdownMenuItem onClick={onNewFolder}>New Folder</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddBookmark triggerRef={linkButtonRef} />
      <InsertFolder triggerRef={folderButtonRef} />
    </>
  );
}
