import ShareFolderForm from "./share-folder-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { shareFolder } from "@/queries/share-folder.queries";
import type { Folder } from "@/types/folder";
import { useMutation } from "@tanstack/react-query";
import { ClipboardIcon } from "lucide-react";
import { type RefObject } from "react";
import { toast } from "sonner";

interface PropsType {
  folder: Folder;
  ref: RefObject<HTMLButtonElement | null>;
}

export default function ShareFolder({ folder, ref }: PropsType) {
  const mutation = useMutation({
    mutationKey: ["share-folder"],
    mutationFn: shareFolder,
    onSuccess: ({ status, data: { data, message } }) => {
      if (status !== 200) {
        toast.error(message || "Failed to add folder");
        return;
      }

      toast.success(data.publicId);
    },
  });

  const btnLabel = folder.isPublic ? "Unpublish Now" : "Publish Now";
  const publicUrl = `${import.meta.env.VITE_API_BASE_URL}/${folder.publicId}`;

  const copyToClipboardHandler = async () => {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Copied public url to clipboard");
  };

  return (
    <Modal
      title="Share Folder"
      form="share-folder-form"
      desc={`When you're happy with it, just hit the ${btnLabel} button`}
      isPending={mutation.isPending}
      triggerButton={<button ref={ref} type="button" className="hidden" />}
      btnTxt={btnLabel}
    >
      <ShareFolderForm
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
    </Modal>
  );
}
