import BookmarkListItem from "./list-item";
import type { Bookmark } from "@/types/bookmark";

interface PropsType {
  bookmarks: Bookmark[];
}

export default function BookmarkList({ bookmarks }: PropsType) {
  return bookmarks?.map((bookmark) => (
    <BookmarkListItem key={bookmark.id} bookmark={bookmark} />
  ));
}
