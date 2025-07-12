import BookmarkCards from "../_authenticated/bookmarks/-components/bookmark-cards";
import { BookmarkSkeleton } from "../_authenticated/bookmarks/-components/bookmark-cards/skeletions";
import Footer from "./-components/footer";
import Header from "./-components/header";
import LoadingSkeleton from "./-components/loading-skeleton";
import PublicDetails from "./-components/public-details";
import UnlockContent from "./-components/unlock-content";
import ContainerSize from "@/components/dev/container-size";
import { CardsLayout } from "@/components/layouts/cards-layout";
import NotFound from "@/components/not-found";
import { fetchPublicBookmarks } from "@/queries/share-folder.queries";
import useLayoutStore from "@/stores/layout.store";
import type { Bookmark } from "@/types/bookmark";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import clsx from "clsx";
import { Suspense } from "react";

export const Route = createFileRoute("/_public/$uname/folder/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const layout = useLayoutStore((s) => s.layout);
  const queryKey = ["public-folder", params.id];

  const {
    data,
    isFetching: isDataFetching,
    isFetched: isDataFetched,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => await fetchPublicBookmarks(params.id),
  });

  const queryClient = useQueryClient();

  if (isDataFetched && error && (error as AxiosError)?.status === 401) {
    return (
      <UnlockContent
        folderId={params.id}
        onSuccessFunc={() => queryClient.invalidateQueries({ queryKey })}
      />
    );
  }

  if (
    !isDataFetching &&
    isDataFetched &&
    (error ? (error as AxiosError)?.status !== 401 : !data)
  ) {
    return <NotFound />;
  }

  // NOTE: This approach of showing loading skeletons is fine until infinity query is implemented

  return (
    <div className="@container/dash mx-auto w-full max-w-6xl space-y-4 px-4 select-none">
      <Header folderId={params.id} queryKey={queryKey} />
      {isDataFetching ? (
        <LoadingSkeleton />
      ) : (
        <>
          <ContainerSize />
          <PublicDetails data={data} />
          <CardsLayout
            layout={layout}
            className={clsx("relative", { "pb-20": isDataFetching })}
          >
            <Suspense fallback={<BookmarkSkeleton layout={layout} />}>
              <BookmarkCards
                bookmarks={(data?.bookmarks as Bookmark[]) ?? []}
                showActions={false}
              />
            </Suspense>
          </CardsLayout>
          <Footer />
        </>
      )}
    </div>
  );
}
