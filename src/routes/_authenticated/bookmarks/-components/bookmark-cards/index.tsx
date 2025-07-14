import BookmarkCard from "./card";
import { useToolbarStore } from "@/stores/toolbar.store";
import type { Bookmark } from "@/types/bookmark";

interface PropsType {
  bookmarks: Bookmark[];
  showActions?: boolean;
}

const BookmarkCards = ({ bookmarks, showActions = true }: PropsType) => {
  const isEditEnabled = useToolbarStore((s) => s.isBulkEdit);

  return bookmarks.map((bookmark) => (
    <BookmarkCard
      key={bookmark.id}
      bookmark={bookmark}
      enableCheckbox={isEditEnabled}
      showActions={showActions}
    />
  ));
};

export default BookmarkCards;
