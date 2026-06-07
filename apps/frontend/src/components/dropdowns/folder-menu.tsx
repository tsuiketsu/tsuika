import clsx from "clsx";
import { Ellipsis } from "lucide-react";
import type React from "react";
import { Fragment, lazy, Suspense, useState } from "react";
import { toast } from "sonner";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import {
  updatePreferencesHandler,
  useUserProfileStore,
} from "@/stores/user-profile.store";
import type { Folder } from "@/types/folder";
import CollaborateFolder from "../forms/folder/collaborate";
import { useCollaboratorForderStore } from "../forms/folder/collaborate/store";
import LazyBoundary from "../lazy-boundary";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const UpdateFolder = lazy(() => import("../forms/folder/update-folder"));
const SharedFolder = lazy(() => import("../forms/folder/share-folder"));
const DeleteFolder = lazy(() => import("../forms/folder/delete-folder"));

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
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  const { profile, isFolderPinned, setPreferences } = useUserProfileStore();
  const { isSecured: isFolderSecured } = useSecuredFolders();

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
        },
      );
    });

    const message = isPinned ? toastMessages.pinned : toastMessages.notPinned;

    toast.promise(promise, {
      loading: message.loading,
      success: message.success,
      error: "Something went wrong, please try again later",
    });
  };

  const isEncrypted = folder.settings?.keyDerivation;

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
          <DropdownMenuItem
            className={clsx({ hidden: isEncrypted })}
            onClick={() => useCollaboratorForderStore.getState().toggleOpen()}
          >
            <span>Collaborative</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenShare(true)}
            className={clsx({ hidden: isEncrypted })}
          >
            <span>Publish/Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenDelete(true)}
          >
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LazyBoundary isVisible={openUpdate}>
        <UpdateFolder
          folder={folder}
          open={openUpdate}
          setOpen={setOpenUpdate}
        />
      </LazyBoundary>

      <LazyBoundary isVisible={openDelete}>
        <DeleteFolder
          id={folder.id}
          open={openDelete}
          setOpen={setOpenDelete}
        />
      </LazyBoundary>

      <LazyBoundary isVisible={openShare}>
        <SharedFolder folder={folder} open={openShare} setOpen={setOpenShare} />
      </LazyBoundary>

      {/* Load CollaborateFolder only if folder is not secured */}
      {!isFolderSecured && (
        <Suspense>
          <CollaborateFolder folderId={folder.id} />
        </Suspense>
      )}
    </Fragment>
  );
};

export default FolderMenu;
