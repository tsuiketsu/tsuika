import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBookamrk } from "@/queries/bookmark.queries";
import type { Bookmark } from "@/types/bookmark";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { format } from "date-fns/format";
import { HashIcon, PencilLineIcon } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/bookmarks/_bookmark/b/$id"
)({
  component: Main,
});

function formatDate(timestamp: Date | string | undefined) {
  return timestamp ? format(new Date(timestamp), "dd/MM/yyyy hh:mm:ss") : "";
}

const Loading = () => {
  const tagSkeletions = Array.from({ length: 5 }).map((_, idx) => (
    <Skeleton className="h-6 w-18" key={`tag-skeletion-${idx}`} />
  ));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center space-y-6">
      <Skeleton className="aspect-video w-full" />
      <div className="w-full space-y-2">
        <Skeleton className="mx-auto h-8 w-11/12" />
        <Skeleton className="mx-auto h-8 w-9/12" />
      </div>
      <div className="inline-flex w-full max-w-3/4 flex-wrap justify-center gap-1">
        {tagSkeletions}
      </div>
      <div className="w-full space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
};

const Content = ({ bookmark }: { bookmark: Bookmark | undefined }) => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <div className="pb-2 select-none">
        <Badge className="gap-1">
          {bookmark?.updatedAt && <PencilLineIcon size={14} />}
          {bookmark?.updatedAt
            ? formatDate(bookmark.updatedAt)
            : formatDate(bookmark?.createdAt)}
        </Badge>
      </div>
      <div className="mb-6 aspect-video">
        <img
          src={bookmark?.thumbnail}
          alt={bookmark?.title}
          className="size-full rounded-xl object-cover select-none"
        />
      </div>
      <h2
        className={clsx(
          "mx-auto max-w-11/12 text-center text-2xl font-bold",
          (bookmark?.tags?.length || 0) > 0 ? "mb-2" : "mb-6"
        )}
      >
        {bookmark?.title}
      </h2>
      <div
        className={clsx(
          "mx-auto flex w-full max-w-3/4 flex-wrap justify-center gap-2 pb-6",
          { hidden: bookmark?.tags?.length === 0 }
        )}
      >
        {bookmark?.tags?.map((tag, idx) => (
          <Badge
            variant="secondary"
            key={`bookmar-details-tag-${idx}`}
            className="gap-0.5"
          >
            <span>
              <HashIcon size={12} />
            </span>
            {tag.name}
          </Badge>
        ))}
      </div>
      <p>{bookmark?.description}</p>
    </div>
  );
};

function Main() {
  const { id } = Route.useParams();

  const {
    data: bookmark,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ["bookmark", id],
    queryFn: async () => await fetchBookamrk(id),
  });

  if (isFetching) return <Loading />;

  if (isFetched && !bookmark) return "Data not found!";

  return <Content bookmark={bookmark} />;
}
