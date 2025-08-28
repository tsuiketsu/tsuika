import ShareFolderForm from "./share-folder-form";
import {
  usePublishMutation,
  useUnpublishMutation,
  useUpdateMutation,
} from "./share-folder.mutations";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import type { Setter } from "@/lib/utils";
import { fetchSharedFolderInfo } from "@/queries/share-folder.queries";
import type { Folder } from "@/types/folder";
import { useQuery } from "@tanstack/react-query";
import { ClipboardIcon } from "lucide-react";
import { toast } from "sonner";

interface PropsType {
  folder: Folder;
  open: boolean;
  setOpen: Setter<boolean>;
}

export default function ShareFolder({ folder, open, setOpen }: PropsType) {
  const { data } = useSession();

  const { data: sharedFolder, isFetching } = useQuery({
    queryKey: ["shared-folder", folder.publicId],
    queryFn: async () => await fetchSharedFolderInfo(folder.publicId ?? ""),
    enabled: folder.publicId != null,
  });

  const publishMutation = usePublishMutation();
  const unpublishMutation = useUnpublishMutation();
  const updateMutation = useUpdateMutation({
    onSuccessFunc: () => setOpen(false),
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="xs:max-w-sm w-full">
        <SheetHeader>
          <SheetTitle>Share Folder</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <ShareFolderForm
            folder={sharedFolder}
            onSubmit={(payload) => {
              if (sharedFolder?.isPublic) {
                return updateMutation.mutate({ id: folder.id, payload });
              }
              return publishMutation.mutate({ id: folder.id, payload });
            }}
          />
        </div>
        {isFetching ? (
          <div className="w-full space-y-2 px-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="xs:h-9 mx-auto h-12" />
          </div>
        ) : (
          sharedFolder?.isPublic &&
          folder.publicId && (
            <div className="flex flex-col gap-1 px-4">
              <span className="text-sm font-medium">Copy &amp; Share</span>
              <Button
                variant="outline"
                className="flex w-full justify-between overflow-hidden transition-transform duration-500 hover:scale-97"
                onClick={copyToClipboardHandler}
              >
                <span className="truncate">{getPublicUrl()}</span>
                <ClipboardIcon />
              </Button>
            </div>
          )
        )}

        <SheetFooter className="pt-6">
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

          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
