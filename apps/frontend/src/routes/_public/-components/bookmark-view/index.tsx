import LazyBoundary from "@/components/lazy-boundary";
import { Button } from "@/components/ui/button";
import type { Setter } from "@/lib/utils";
import type { Bookmark } from "@/types/bookmark";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import clsx from "clsx";
import { ArrowRightIcon } from "lucide-react";
import { lazy, useEffect, useRef, useState } from "react";

const MarkdownContent = lazy(() => import("./markdown-content"));

interface PropsType {
  bookmark: Bookmark;
  setBookmark: Setter<Bookmark | null>;
}

export default function BookmarkView({ bookmark, setBookmark }: PropsType) {
  useLockBodyScroll();

  const [showReadMore, setShowReadMore] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const pRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (pRef.current) {
      if (pRef.current.clientHeight > 70) {
        setShowReadMore(true);
      }
    }
  }, []);

  return (
    <div
      data-state={Boolean(bookmark)}
      className={clsx(
        "fixed inset-0 z-10 flex min-h-screen items-center justify-center duration-300",
        "data-[state=true]:animate-in",
        "data-[state=true]:fade-in-0",
        isExtended
          ? "bg-background overflow-y-auto"
          : "backdrop-blur-s bg-black/60"
      )}
    >
      <div
        data-state={Boolean(bookmark)}
        className={clsx(
          "flex w-full flex-col gap-3 duration-300",
          [
            "data-[state=true]:animate-in",
            "data-[state=true]:zoom-in-95",
            "data-[state=true]:fade-in-0",
          ],
          isExtended
            ? "h-full max-w-3xl bg-inherit p-6 transition-none duration-500"
            : "bg-card max-w-96 rounded-xl p-4"
        )}
      >
        <div className="aspect-video shrink-0 overflow-hidden rounded-md">
          <img
            src={bookmark.thumbnail}
            alt=""
            className="size-full object-cover object-top"
          />
        </div>
        {!isExtended && <h3 className="font-medium">{bookmark.title}</h3>}
        {isExtended ? (
          <LazyBoundary>
            <MarkdownContent content={bookmark.description ?? ""} />
          </LazyBoundary>
        ) : (
          <p
            ref={pRef}
            className={clsx("text-sm", isExtended ? "" : "line-clamp-4")}
          >
            {bookmark.description}
          </p>
        )}
        <div
          className={clsx(
            "inline-flex w-full justify-end gap-2 pt-4",
            isExtended && "bg-background fixed bottom-0 left-0 p-4"
          )}
        >
          <Button
            variant="secondary"
            size="sm"
            className="mr-auto h-8"
            onClick={() => setBookmark(null)}
          >
            Close
          </Button>
          <Button variant="info" size="sm" className="h-8" asChild>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              Source
            </a>
          </Button>
          {showReadMore && (
            <Button
              size="sm"
              className="h-8"
              onClick={() => setIsExtended(true)}
            >
              Read More <ArrowRightIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
