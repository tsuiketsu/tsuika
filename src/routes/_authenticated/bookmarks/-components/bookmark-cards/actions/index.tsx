import useBookmarkContext from "../../context/use-context";
import LazyBoundary from "@/components/lazy-boundary";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Bookmark } from "@/types/bookmark";
import { Ellipsis } from "lucide-react";
import React, { lazy, useState } from "react";

const InsertTask = lazy(() => import("@/components/forms/task/insert-task"));

const DeleteBookmark = lazy(
  () => import("@/components/forms/bookmark/delete-bookmark")
);

const UpdateBookmark = lazy(
  () => import("@/components/forms/bookmark/update-bookmark")
);

const BookmarkActionsMobileLayout = lazy(() => import("./layouts/mobile"));
const BookmarkActionsDesktopLayout = lazy(() => import("./layouts/desktop"));

export default function BookmarkActions({ bookmark }: { bookmark: Bookmark }) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // States
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openTaskForm, setOpenTaskForm] = useState(false);

  // Context
  const { query, slug } = useBookmarkContext();

  // Folder hook
  const { isSecured } = useSecuredFolders();

  const onTaskAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTaskForm(true);
  };

  const onEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenUpdateForm(true);
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDeleteConfirmation(true);
  };

  const isMobile = useIsMobile();

  return (
    <div className="group top-2 right-2 z-10 space-x-2 rounded-full">
      {!isActionsOpen && (
        <button
          type="button"
          className="cursor-pointer hover:scale-95"
          onClick={() => setIsActionsOpen(true)}
        >
          <Ellipsis size={18} />
        </button>
      )}

      {isMobile
        ? isActionsOpen && (
            <LazyBoundary>
              <BookmarkActionsMobileLayout
                isVisible={isActionsOpen}
                bookmark={bookmark}
                slug={slug}
                query={query}
                isSecured={isSecured}
                onTaskAdd={onTaskAdd}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </LazyBoundary>
          )
        : isActionsOpen && (
            <LazyBoundary>
              <BookmarkActionsDesktopLayout
                isVisible={isActionsOpen}
                bookmark={bookmark}
                slug={slug}
                query={query}
                isSecured={isSecured}
                onTaskAdd={onTaskAdd}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </LazyBoundary>
          )}

      <InsertTask
        contentType="bookmark"
        contentId={bookmark.id}
        isButtonHidden
        open={openTaskForm}
        setOpen={setOpenTaskForm}
      />

      <UpdateBookmark
        bookmark={bookmark}
        query={query}
        open={openUpdateForm}
        setOpen={setOpenUpdateForm}
      />

      <DeleteBookmark
        id={bookmark.id}
        query={query}
        open={openDeleteConfirmation}
        setOpen={setOpenDeleteConfirmation}
      />
    </div>
  );
}
