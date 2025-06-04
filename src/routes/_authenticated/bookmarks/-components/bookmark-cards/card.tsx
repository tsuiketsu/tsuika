import BookmarkActions from "./actions";
import BookmarkExtras from "./extras";
import BookmarkThumbnail from "./thumbnail";
import Show from "@/components/show";
import { cn } from "@/lib/utils";
import useLayoutStore, {
  cardLayout,
  type CardsLayoutKey,
} from "@/stores/layout.store";
import type { Bookmark } from "@/types/bookmark";

interface PropsType {
  bookmark: Bookmark;
}

export default function BookmarkCard({ bookmark }: PropsType) {
  const layout = useLayoutStore((s) => s.layout);

  return (
    <div
      className={cn(
        "bg-card group @container/main overflow-hidden rounded-md border p-2 duration-150 select-none",
        { "flex gap-2 p-1": layout === cardLayout.COMPACT }
      )}
    >
      <BookmarkThumbnail
        image={bookmark.thumbnail || undefined}
        title={bookmark.title}
        height={bookmark.thumbnailHeight}
        width={bookmark.thumbnailWidth}
      />
      <section className="@container flex w-full flex-col justify-between space-y-2.5">
        <div className="flex w-full flex-col">
          <Title layout={layout} bookmark={bookmark} />
          <Show when={layout === cardLayout.COMPACT}>
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {bookmark.description}
            </p>
          </Show>
        </div>
        <div className="flex w-full items-center justify-between">
          <BookmarkExtras url={bookmark.url} createdAt={bookmark.createdAt} />
          <BookmarkActions bookmark={bookmark} />
        </div>
      </section>
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
    className={cn("inline-flex items-start justify-between pt-1", {
      "pt-0 text-sm": layout === cardLayout.COMPACT,
    })}
  >
    <a href={bookmark.url} target="_blank" rel="noreferrer">
      <h3
        className={cn(
          ["w-[98cqw] truncate"],
          ["transition-transform duration-200"],
          ["underline-offset-2 hover:underline"]
        )}
      >
        {bookmark.title}
      </h3>
    </a>
  </div>
);
