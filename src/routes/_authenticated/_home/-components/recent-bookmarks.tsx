import BookmarkGroup from "./bookmark-group";
import { fetchRecentBookmarks } from "@/queries/bookmark.queries";
import { useQuery } from "@tanstack/react-query";
import { ClockFading } from "lucide-react";

export default function RecentBookmarks() {
  const { data: bookmarks, isFetching } = useQuery({
    queryKey: ["recent-bookmarks"],
    queryFn: fetchRecentBookmarks,
  });

  return (
    <BookmarkGroup
      title="Recently Added"
      isFetching={isFetching}
      bookmarks={bookmarks ?? []}
      fallback={{
        title: "No Recents",
        description: "Recently added bookmarks will appear here",
        icon: ClockFading,
      }}
    />
  );
}
