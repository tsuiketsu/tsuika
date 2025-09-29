import Show from "./show";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { useFoldersData } from "@/hooks/use-folder";
import type { Folder } from "@/types/folder";
import { DialogClose } from "@radix-ui/react-dialog";
import { FolderIcon, LockIcon } from "lucide-react";
import { useRef, useState } from "react";

const FolderItemsSkeleton = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Skeleton key={`folder-opts-ske-${idx}`} className="h-[36px] w-full" />
      ))}
    </div>
  );
};

interface PropsType {
  value?: Folder["id"];
  onChange: (id: Folder["id"]) => void;
}

export default function FolderPicker({ value, onChange }: PropsType) {
  const [selectedId, setSelectedId] = useState<Folder["id"] | null>(
    value ?? null
  );

  const {
    ref: sneakyRef,
    folders,
    isFetching,
    isFetched,
    shouldFetchNext,
  } = useFoldersData();

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const onConfirm = () => {
    if (selectedId) {
      onChange(selectedId);
      closeBtnRef.current?.click();
    }
  };

  const { isSecured } = useSecuredFolders();

  if (!isFetching && isFetched && folders.length === 0) {
    return (
      <Button variant="outline" className="justify-start" disabled>
        Unsorted
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          {isFetching
            ? "Loading...."
            : value
              ? folders.find(({ id }) => id === value)?.name || "Unsorted"
              : "Pick a folder..."}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick Folder</DialogTitle>
        </DialogHeader>
        <div className="bg-secondary/20 flex h-48 flex-col space-y-1 overflow-y-auto rounded-lg border p-2">
          {folders
            .filter((f) => (f.settings?.keyDerivation != null) === isSecured)
            .map((folder, idx) => (
              <Button
                variant={selectedId === folder.id ? "default" : "ghost"}
                className="justify-start"
                key={`folder-option-${idx}`}
                onClick={() => setSelectedId(folder.id)}
              >
                {folder.settings?.keyDerivation ? <LockIcon /> : <FolderIcon />}{" "}
                {folder.name}
              </Button>
            ))}
          <Show when={shouldFetchNext}>
            <span ref={sneakyRef} className="h-1" />
          </Show>
          <FolderItemsSkeleton isVisible={isFetching} />
        </div>
        <DialogFooter>
          <DialogClose ref={closeBtnRef} asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button onClick={onConfirm}>Choose</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
