import ShareFolderForm from "./share-folder-form";
import {
  usePublishMutation,
  useUnpublishMutation,
  useUpdateMutation,
} from "./share-folder.mutations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";
import { fetchSharedFolderInfo } from "@/queries/share-folder.queries";
import type { Folder } from "@/types/folder";
import { useQuery } from "@tanstack/react-query";
import { ClipboardIcon } from "lucide-react";
import { useRef, type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  folder: Folder;
  ref: RefObject<HTMLButtonElement | null>;
}

export default function ShareFolder({ folder, ref }: PropsType) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { data } = useSession();

  const { data: sharedFolder } = useQuery({
    queryKey: ["shared-folder", folder.publicId],
    queryFn: async () => await fetchSharedFolderInfo(folder.publicId ?? ""),
    enabled: folder.publicId != null,
  });

  const publishMutation = usePublishMutation();
  const unpublishMutation = useUnpublishMutation();
  const updateMutation = useUpdateMutation({
    onSuccessFunc: () => closeRef.current?.click(),
  });

  const getPublicUrl = () => {
    const host = import.meta.env.VITE_FRONTEND_BASE_URL;
    const username = data?.user.username;
    const id = folder.publicId;

    return `${host}/${username}/folder/${id}`;
  };

  const copyToClipboardHandler = async () => {
    await navigator.clipboard.writeText(getPublicUrl());
    toast.success("Copied public url to clipboard");
  };

  const isPublish = !sharedFolder;
  const isRepublish = sharedFolder && !sharedFolder.isPublic;
  const isUpdate = sharedFolder && sharedFolder.isPublic;
  const isUnpublish = isUpdate;

  return (
    <Dialog>
      <DialogTrigger ref={ref} className="hidden" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Folder</DialogTitle>
        </DialogHeader>
        <ShareFolderForm
          folder={sharedFolder}
          onSubmit={(payload) => {
            if (sharedFolder?.isPublic) {
              return updateMutation.mutate({ id: folder.id, payload });
            }
            return publishMutation.mutate({ id: folder.id, payload });
          }}
        />
        {sharedFolder?.isPublic && folder.publicId && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Copy &amp; Share</span>
            <Button
              variant="outline"
              className="flex w-full justify-between transition-transform duration-500 hover:scale-97"
              onClick={copyToClipboardHandler}
            >
              {getPublicUrl()}
              <ClipboardIcon />
            </Button>
          </div>
        )}
        <DialogFooter className="pt-6">
          <DialogClose ref={closeRef} asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {isUnpublish && (
            <Button
              variant="destructive"
              isLoading={unpublishMutation.isPending}
              onClick={() => unpublishMutation.mutate(sharedFolder.id)}
              className="min-w-25"
            >
              Unpublish
            </Button>
          )}

          {isUpdate && (
            <Button
              type="submit"
              form="share-folder-form"
              className="min-w-25"
              isLoading={updateMutation.isPending}
            >
              Update
            </Button>
          )}

          {(isPublish || isRepublish) && (
            <Button
              isLoading={publishMutation.isPending}
              type="submit"
              form="share-folder-form"
              className="min-w-28"
            >
              {isPublish ? "Publish" : "Re-Publish"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
