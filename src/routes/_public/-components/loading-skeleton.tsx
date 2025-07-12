import { CardsLayout } from "@/components/layouts/cards-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkSkeletons } from "@/routes/_authenticated/bookmarks/-components/bookmark-cards/skeletons";
import useLayoutStore from "@/stores/layout.store";

const PublicDetailsSkeleton = () => (
  <div className="mx-auto flex w-full flex-col items-center space-y-4 border-b pt-30 pb-4">
    <Skeleton className="size-26 rounded-full" />
    <Skeleton className="h-11 w-full max-w-lg" />
    <Skeleton className="h-6 w-full max-w-32" />
    <Skeleton className="h-6 w-full max-w-68" />
    <div className="flex h-36 w-full max-w-2xl flex-col justify-between gap-3 rounded-xl border p-3">
      <Skeleton className="h-full w-full" />
      <div className="inline-flex w-full items-end justify-between">
        <Skeleton className="h-5 w-full max-w-38" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  </div>
);

export default function LoadingSkeleton() {
  const layout = useLayoutStore((s) => s.layout);

  return (
    <>
      <PublicDetailsSkeleton />
      <CardsLayout layout={layout}>
        <BookmarkSkeletons isLoading={true} bookmarksLength={6} />
      </CardsLayout>
    </>
  );
}
