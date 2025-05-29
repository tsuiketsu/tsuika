import BookmarkSkeleton from "./bookmark-skeleton";
import { SvgSpinners3DotsScale } from "@/components/icons/dots-loader";
import useLayoutStore from "@/stores/layout.store";

interface PropsType {
  isLoading: boolean;
  bookmarksLength: number;
}

const BookmarkSkeletons = ({ isLoading, bookmarksLength }: PropsType) => {
  const layout = useLayoutStore((s) => s.layout);

  if (!isLoading) {
    return null;
  }

  if (layout === "masonry" && bookmarksLength > 0) {
    return (
      <div className="absolute bottom-0 left-0 inline-flex w-full items-end">
        <SvgSpinners3DotsScale width={58} height={50} className="mx-auto" />
      </div>
    );
  }

  return Array.from({ length: 16 }).map((_, idx) => (
    <BookmarkSkeleton key={`bookmark-skeleton-${idx}`} layout={layout} />
  ));
};

export default BookmarkSkeletons;
