import BookmarkActions from "./actions";
import BookmarkCheckbox from "./checkbox";
import BookmarkExtras from "./extras";
import BookmarkThumbnail from "./thumbnail";
import Show from "@/components/show";
import { cn } from "@/lib/utils";
import useLayoutStore, {
  cardLayout,
  type CardsLayoutKey,
} from "@/stores/layout.store";
import type { Bookmark } from "@/types/bookmark";
import clsx from "clsx";

interface PropsType {
  bookmark: Bookmark;
  enableCheckbox: boolean;
}

export default function BookmarkCard(props: PropsType) {
  const { bookmark, enableCheckbox = false } = props;
  const layout = useLayoutStore((s) => s.layout);

  return (
    <div
      className={cn(
        "bg-card group @container/main relative flex flex-col overflow-hidden rounded-md p-2 shadow-xs select-none",
        { "flex-row gap-2 p-1": layout === cardLayout.COMPACT }
      )}
    >
      <BookmarkThumbnail
        image={bookmark.thumbnail || undefined}
        title={bookmark.title || "Untitled"}
        height={bookmark.thumbnailHeight}
        width={bookmark.thumbnailWidth}
      />
      <div className="@container flex h-full w-full flex-col justify-between space-y-3">
        <div className="flex w-full flex-col">
          <Title layout={layout} bookmark={bookmark} />
          <Show when={layout === cardLayout.COMPACT}>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {bookmark.description}
            </p>
          </Show>
        </div>
        <div className="flex w-full items-center justify-between">
          <BookmarkExtras
            url={bookmark.url}
            folderId={bookmark.folderId}
            createdAt={bookmark.createdAt}
          />
          <BookmarkActions bookmark={bookmark} />
        </div>
      </div>
      <span
        className={clsx("absolute top-0 right-0 z-10 text-xl", {
          hidden: !bookmark.isPinned,
        })}
        role="img"
        aria-label="pin"
      >
        📌
      </span>
      <Show when={enableCheckbox}>
        <BookmarkCheckbox bookmarkId={bookmark.id} />
      </Show>
    </div>
  );
}

const Title = ({
  layout,
  bookmark,
}: {
  bookmark: Bookmark;
  layout: CardsLayoutKey;
}) => (
  <div
    className={cn("inline-flex items-start justify-between pt-2 text-sm", {
      "pt-0": layout === cardLayout.COMPACT,
    })}
  >
    <a href={bookmark.url} target="_blank" rel="noreferrer">
      <h3
        className={cn(
          ["line-clamp-2 w-[98cqw]"],
          ["transition-transform duration-200"],
          ["underline-offset-2 hover:underline"],
          { truncate: layout === cardLayout.COMPACT }
        )}
      >
        {bookmark?.title}
      </h3>
    </a>
  </div>
);
