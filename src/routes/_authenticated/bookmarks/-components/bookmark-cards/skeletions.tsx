import { SvgSpinners3DotsScale } from "@/components/icons/dots-loader";
import Show from "@/components/show";
import { Skeleton } from "@/components/ui/skeleton";
import useLayoutStore, {
  cardLayout,
  type CardsLayoutKey,
} from "@/stores/layout.store";
import { getRandomAspectRatio } from "@/utils";
import clsx from "clsx";
import { useMemo } from "react";

interface PropsType {
  isLoading: boolean;
  bookmarksLength: number;
}

export const BookmarkSkeletons = ({
  isLoading,
  bookmarksLength,
}: PropsType) => {
  const layout = useLayoutStore((s) => s.layout);

  if (!isLoading) {
    return null;
  }

  if (layout === cardLayout.MASONRY && bookmarksLength > 0) {
    return (
      <div className="absolute bottom-0 left-0 inline-flex w-full items-end">
        <SvgSpinners3DotsScale width={58} height={50} className="mx-auto" />
      </div>
    );
  }

  return Array.from({ length: bookmarksLength ?? 16 }).map((_, idx) => (
    <BookmarkSkeleton key={`bookmark-skeleton-${idx}`} layout={layout} />
  ));
};

export const BookmarkSkeleton = ({ layout }: { layout: CardsLayoutKey }) => {
  const aspectRatio = useMemo(() => {
    if (layout === cardLayout.MASONRY) {
      const { width, height } = getRandomAspectRatio();
      return `${width}/${height}`;
    }

    if (layout === cardLayout.COMPACT) {
      return "";
    }

    return "16/9";
  }, [layout]);

  return (
    <div
      className={clsx({
        "flex h-auto flex-col justify-between rounded-md border p-2":
          layout === cardLayout.GRID,
      })}
    >
      <Skeleton
        style={{ aspectRatio }}
        className={clsx("break-inside-avoid", {
          "h-20 w-full rounded-sm": layout === cardLayout.COMPACT,
        })}
      />
      <Show when={layout === cardLayout.GRID}>
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
