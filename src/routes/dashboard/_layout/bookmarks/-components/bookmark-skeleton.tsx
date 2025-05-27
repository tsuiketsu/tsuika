import { Skeleton } from "@/components/ui/skeleton";
import { type CardsLayoutKey } from "@/stores/layout.store";
import { getRandomAspectRatio } from "@/utils";
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
    <Skeleton
      className="aspect-video break-inside-avoid"
      style={{ aspectRatio }}
    />
  );
};

export default BookmarkSkeleton;
