import BookmarkActions from "./actions";
import BookmarkThumbnail from "./thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/types/bookmark";
import dayjs from "dayjs";
import { parse } from "tldts";

interface PropsType {
  bookmark: Bookmark;
}

export default function BookmarkCard({ bookmark }: PropsType) {
  return (
    <div className="bg-card group @container/main overflow-hidden rounded-md border p-2 duration-150 select-none">
      <BookmarkThumbnail
        image={bookmark.thumbnail || undefined}
        title={bookmark.title}
        height={bookmark.thumbnailHeight}
        width={bookmark.thumbnailWidth}
      />
      <section className="space-y-2.5">
        <h3 className="truncate transition-transform duration-200">
          {bookmark.title}
        </h3>
        <div className="inline-flex w-full items-center justify-between">
          <Extras url={bookmark.url} createdAt={bookmark.createdAt} />
          <BookmarkActions bookmark={bookmark} />
        </div>
      </section>
    </div>
  );
}

const Extras = (props: { url: string; createdAt: string | Date }) => {
  const domain = parse(props.url).domain;
  return (
    <div className="text-foreground/60 inline-flex items-center space-x-2 text-xs font-medium">
      <Button variant="info" className="h-6 px-2 text-xs" asChild>
        <a href={`https://${domain}`} target="_blank" rel="noreferrer">
          {domain}
        </a>
      </Button>
      <Badge variant="outline">
        <span>{dayjs(props.createdAt).format("MMM DD, YYYY")}</span>
      </Badge>
    </div>
  );
};
