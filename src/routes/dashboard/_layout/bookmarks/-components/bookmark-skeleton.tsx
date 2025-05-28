import Show from "@/components/show";
import { Skeleton } from "@/components/ui/skeleton";
import { type CardsLayoutKey } from "@/stores/layout.store";
import { getRandomAspectRatio } from "@/utils";
import clsx from "clsx";
import { useMemo } from "react";

const BookmarkSkeleton = ({ layout }: { layout: CardsLayoutKey }) => {
  const aspectRatio = useMemo(() => {
    if (layout === "masonry") {
      const { width, height } = getRandomAspectRatio();
      return `${width}/${height}`;
    }
    return "16/9";
  }, [layout]);

  return (
    <div
      className={clsx({
        "flex h-auto flex-col justify-between rounded-md border p-2":
          layout === "grid",
      })}
    >
      <Skeleton className="break-inside-avoid" style={{ aspectRatio }} />
      <Show when={layout === "grid"}>
        <div className="flex h-full flex-col justify-between gap-3 pt-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="inline-flex gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default BookmarkSkeleton;
