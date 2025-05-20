import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useFolderData } from "@/hooks/user-folder.hook";
import { DialogClose } from "@radix-ui/react-dialog";
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
  value?: number;
  onChange: (id: number) => void;
}

export default function FolderPicker({ value, onChange }: PropsType) {
  const [selectedId, setSelectedId] = useState<number | null>(value ?? null);

  const { ref: sneakyRef, folders, isFetching } = useFolderData(5);

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const onConfirm = () => {
    if (selectedId) {
      onChange(selectedId);
      closeBtnRef.current?.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start">
          {isFetching
            ? "Loading...."
            : value
              ? folders.find(({ id }) => id === value)?.name
              : "Pick a folder..."}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a folder</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-secondary/20 grid h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
          {folders.map((folder, idx) => (
            <Button
              variant={selectedId === folder.id ? "default" : "ghost"}
              className="justify-start"
              key={`folder-option-${idx}`}
              onClick={() => setSelectedId(folder.id)}
            >
              {folder.name}
            </Button>
          ))}
          <span ref={sneakyRef} className="h-1" />
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
