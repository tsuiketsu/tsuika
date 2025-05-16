import type { Bookmark } from "@/types/bookmark";
import BookmarkCard from "./bookmark-card";

const BookmarkCards = ({ bookmarks }: { bookmarks: Bookmark[] }) =>
  bookmarks.map((bookmark) => (
    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
  ));

export default BookmarkCards;
