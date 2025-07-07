import DeleteFolder from "../forms/folder/delete-folder";
import ShareFolder from "../forms/folder/share-folder";
import UpdateFolder from "../forms/folder/update-folder";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  updatePreferencesHandler,
  useUserProfileStore,
} from "@/stores/user-profile.store";
import type { Folder } from "@/types/folder";
import clsx from "clsx";
import { Ellipsis } from "lucide-react";
import React, { Fragment, useRef } from "react";
import { toast } from "sonner";

interface PropsType {
  folder: Folder;
  triggerButton?: React.ReactNode;
}

const toastMessages = {
  pinned: {
    loading: "Unpinning folder...",
    success: "Unpinned folder from dashboard",
  },
  notPinned: {
    loading: "Pinning folder...",
    success: "📌 Pinned folder to dashboard",
  },
};

const FolderMenu = ({ folder, triggerButton }: PropsType) => {
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  const { profile, isFolderPinned, setPreferences } = useUserProfileStore();

  const setPinHandler = () => {
    const isPinned = isFolderPinned(folder.id);

    const promise = new Promise((resolve, reject) => {
      const prev = profile?.preferencesJson.pinnedFolders;

      if (!isPinned && prev && prev.length === 6) {
        toast.error("Can't pin more than 6 folders on dashboard");
        return;
      }

      let payload = [...(prev ?? []), folder.id];

      if (isPinned) {
        payload = prev?.filter((id) => folder.id !== id) ?? [];
      }

      updatePreferencesHandler({ pinnedFolders: payload }).then(
        ({ data: response }) => {
          if (response.success) {
            setPreferences(response.data.preferencesJson);
            return resolve({});
          }

          return reject();
        }
      );
    });

    const message = isPinned ? toastMessages.pinned : toastMessages.notPinned;

    toast.promise(promise, {
      loading: message.loading,
      success: message.success,
      error: "Something went wrong, please try again later",
    });
  };

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
          <DropdownMenuItem onClick={setPinHandler}>
            <span>
              {isFolderPinned(folder.id)
                ? "Unpin from dashbaord"
                : "Pin to Dashboard"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editButtonRef.current?.click()}>
            <span>Edit Folder</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => shareButtonRef.current?.click()}
            className={clsx({ hidden: folder.keyDerivation })}
          >
            <span>Share Folder</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => deleteButtonRef.current?.click()}
          >
            <span>Delete Folder</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateFolder folder={folder} ref={editButtonRef} />
      <DeleteFolder id={folder.id} ref={deleteButtonRef} />
      <ShareFolder folder={folder} ref={shareButtonRef} />
    </Fragment>
  );
};

export default FolderMenu;
