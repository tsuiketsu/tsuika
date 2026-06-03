import DeleteForm from "./delete-form";
import Show from "@/components/show";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { useToolbarStore } from "@/stores/toolbar.store";
import clsx from "clsx";
import { SquareDashedMousePointer, X } from "lucide-react";
import { lazy, Suspense } from "react";

const FolderForm = lazy(() => import("./folder-form"));

export default function BulkEdit({ slug }: { slug: string }) {
  const isBulkEdit = useToolbarStore((s) => s.isBulkEdit);
  const toggleBulkEdit = useToolbarStore((s) => s.toggleBulkEdit);
  const folder = useSecuredFolders();

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
        {!folder.isSecured && (
          <Suspense fallback={<Skeleton className="size-8 w-20 rounded-lg" />}>
            <FolderForm slug={slug} />
          </Suspense>
        )}
        <DeleteForm slug={slug} />
      </Show>
    </div>
  );
}
