import BookmarkCard from "./bookmark-card";
import type { Bookmark } from "@/types/bookmark";

interface PropsType {
  bookmarks: Bookmark[];
}

const BookmarkCards = ({ bookmarks }: PropsType) =>
  bookmarks.map((bookmark) => (
    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
  ));

export default BookmarkCards;
