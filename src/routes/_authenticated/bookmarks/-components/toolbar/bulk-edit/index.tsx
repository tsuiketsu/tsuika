import DeleteForm from "./delete-form";
import FolderForm from "./folder-form";
import Show from "@/components/show";
import { Button } from "@/components/ui/button";
import { useToolbarStore } from "@/stores/toolbar.store";
import clsx from "clsx";
import { SquareDashedMousePointer, X } from "lucide-react";

export default function BulkEdit() {
  const isBulkEdit = useToolbarStore((s) => s.isBulkEdit);
  const toggleBulkEdit = useToolbarStore((s) => s.toggleBulkEdit);

  return (
    <div className="inline-flex space-x-2">
      <Button
        variant="outline"
        onClick={toggleBulkEdit}
        size="icon"
        className={clsx({ "rounded-full": isBulkEdit })}
      >
        {isBulkEdit ? (
          <X className="text-destructive" />
        ) : (
          <SquareDashedMousePointer />
        )}
      </Button>
      <Show when={isBulkEdit}>
        <FolderForm />
        <DeleteForm />
      </Show>
    </div>
  );
}
