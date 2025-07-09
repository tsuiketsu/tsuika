import BookmarkCards from "../_authenticated/bookmarks/-components/bookmark-cards";
import {
  BookmarkSkeleton,
  BookmarkSkeletons,
} from "../_authenticated/bookmarks/-components/bookmark-cards/skeletions";
import Header from "./-components/Header";
import PublicDetails from "./-components/PublicDetails";
import ContainerSize from "@/components/dev/container-size";
import { CardsLayout } from "@/components/layouts/cards-layout";
import { fetchPublicBookmarks } from "@/queries/share-folder.queries";
import useLayoutStore from "@/stores/layout.store";
import type { Bookmark } from "@/types/bookmark";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { Suspense } from "react";

export const Route = createFileRoute("/_public/$uname/folder/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const layout = useLayoutStore((s) => s.layout);

  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["public-folder", params.id],
    queryFn: async () => await fetchPublicBookmarks(params.id),
  });

  if (isFetched && !data) {
    return null;
  }

  return (
    <div className="@container/dash mx-auto w-full max-w-6xl space-y-4 px-4 pb-24 select-none">
      <ContainerSize />
      <Header />
      <PublicDetails isFetching={isFetching} data={data} />
      <CardsLayout
        layout={layout}
        className={clsx("relative", { "pb-20": isFetching })}
      >
        <Suspense fallback={<BookmarkSkeleton layout={layout} />}>
          <BookmarkCards
            bookmarks={(data?.bookmarks as Bookmark[]) ?? []}
            showActions={false}
          />
        </Suspense>
        <BookmarkSkeletons
          isLoading={isFetching}
          bookmarksLength={data?.bookmarks.length ?? 9}
        />
      </CardsLayout>
    </div>
  );
}
