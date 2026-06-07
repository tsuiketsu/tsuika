import { useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { useToolbarStore } from "@/stores/toolbar.store";
import type { Bookmark } from "@/types/bookmark";
import BookmarkCard from "./card";

interface PropsType {
  bookmarks: Bookmark[];
  showActions?: boolean;
  onThumbnailClick?: (bookmark: Bookmark) => void;
}

export default function BookmarkCards({
  bookmarks,
  showActions = true,
  ...props
}: PropsType) {
  const isEditEnabled = useToolbarStore((s) => s.isBulkEdit);
  const navigate = useNavigate();
  const id = useId();

  const {
    onThumbnailClick = (bookmark: Bookmark) =>
      navigate({
        to: "/bookmarks/b/$id",
        params: { id: bookmark.id },
      }),
  } = props;

  return bookmarks.map((bookmark) => (
    <BookmarkCard
      key={`${bookmark.id}+${id}`}
      bookmark={bookmark}
      enableCheckbox={isEditEnabled}
      showActions={showActions}
      onThumbnailClick={() => onThumbnailClick?.(bookmark)}
    />
  ));
}
