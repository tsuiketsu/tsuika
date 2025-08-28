import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { useWindowSize } from "@uidotdev/usehooks";
import clsx from "clsx";
import { FolderPlusIcon, PlusIcon } from "lucide-react";
import { lazy, Suspense, useRef } from "react";

const InsertFolder = lazy(
  () => import("@/components/forms/folder/insert-folder")
);
const AddBookmark = lazy(
  () => import("@/components/forms/bookmark/insert-bookmark")
);

export default function DropdownOptions() {
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const folderButtonRef = useRef<HTMLButtonElement>(null);

  const { isLocked } = useSecuredFolders();

  const onNewLink = () => {
    linkButtonRef.current?.click();
  };

  const onNewFolder = () => {
    folderButtonRef.current?.click();
  };

  const { width } = useWindowSize();

  return (
    <>
      {(width ?? 0) > 480 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={clsx(
              buttonVariants({ variant: "outline", size: "icon" }),
              "mr-0"
            )}
          >
            <PlusIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2.5">
            {!isLocked && (
              <DropdownMenuItem onClick={onNewLink}>New Link</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onNewFolder}>
              New Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="fixed right-0 bottom-0 z-10 inline-flex gap-2 p-4">
          <Button
            size="icon"
            className="size-14 rounded-xl shadow-lg"
            onClick={onNewFolder}
          >
            <FolderPlusIcon className="size-5" />
          </Button>
          <Button
            size="icon"
            className="size-14 rounded-xl shadow-lg"
            onClick={onNewLink}
          >
            <PlusIcon className="size-5" />
          </Button>
        </div>
      )}
      {!isLocked && (
        <Suspense>
          <AddBookmark triggerRef={linkButtonRef} />
        </Suspense>
      )}
      <InsertFolder triggerRef={folderButtonRef} />
    </>
  );
}
