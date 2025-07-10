import ShareFolderForm from "./share-folder-form";
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
import {
  fetchSharedFolderInfo,
  shareFolder,
  unpublishFolder,
} from "@/queries/share-folder.queries";
import type { Folder } from "@/types/folder";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClipboardIcon } from "lucide-react";
import { type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  folder: Folder;
  ref: RefObject<HTMLButtonElement | null>;
}

export default function ShareFolder({ folder, ref }: PropsType) {
  const { data } = useSession();

  const { data: sharedFolder } = useQuery({
    queryKey: ["shared-folder", folder.publicId],
    queryFn: async () => await fetchSharedFolderInfo(folder.publicId ?? ""),
    enabled: folder.publicId != null,
  });

  const mutation = useMutation({
    mutationKey: ["publish-folder"],
    mutationFn: shareFolder,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add folder");
        return;
      }

      toast.success(data.publicId);
    },
  });

  const unpublishMutation = useMutation({
    mutationKey: ["unpublish-folder"],
    mutationFn: unpublishFolder,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add folder");
        return;
      }

      toast.success(data.id);
    },
  });

  // const btnLabel = sharedFolder?.isPublic ? "Unpublish" : "Publish";
  const publicUrl = `${import.meta.env.VITE_FRONTEND_BASE_URL}/${data?.user.username}/folder/${folder.publicId}`;

  const copyToClipboardHandler = async () => {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Copied public url to clipboard");
  };

  return (
    <Dialog>
      <DialogTrigger ref={ref} className="hidden" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Folder</DialogTitle>
        </DialogHeader>
        <ShareFolderForm
          folder={sharedFolder}
          onSubmit={(payload) => mutation.mutate({ id: folder.id, payload })}
        />
        {folder.isPublic && folder.publicId && (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Copy &amp; Share</span>
            <Button
              variant="outline"
              className="flex w-full justify-between transition-transform duration-500 hover:scale-97"
              onClick={copyToClipboardHandler}
            >
              {publicUrl}
              <ClipboardIcon />
            </Button>
          </div>
        )}
        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {sharedFolder && sharedFolder.isPublic && (
            <Button
              variant="destructive"
              isLoading={unpublishMutation.isPending}
              onClick={() => unpublishMutation.mutate(sharedFolder.id)}
            >
              Unpublish
            </Button>
          )}
          <Button>{sharedFolder?.isPublic ? "Update" : "Publish"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
