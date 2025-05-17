import { Skeleton } from "@/components/ui/skeleton";

const BookmarkSkeleton = () => (
  <div className="space-y-2 w-full overflow-hidden">
    <Skeleton className="aspect-video" />
    <section className="font-roboto space-y-1">
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-2/4 h-6" />
    </section>
  </div>
);

export default BookmarkSkeleton;
