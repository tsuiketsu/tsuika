import BookmarkCards from "../_authenticated/bookmarks/-components/bookmark-cards";
import { BookmarkSkeleton } from "../_authenticated/bookmarks/-components/bookmark-cards/skeletons";
import BookmarkView from "./-components/bookmark-view";
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
import { Suspense, useEffect, useState } from "react";

export const Route = createFileRoute("/_public/$uname/folder/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const layout = useLayoutStore((s) => s.layout);
  const queryKey = ["public-folder", params];
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );

  const {
    data,
    isFetching: isDataFetching,
    isFetched: isDataFetched,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => await fetchPublicBookmarks(params.uname, params.id),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    function onPopState(e: PopStateEvent) {
      if (!e.state.overlay) {
        setSelectedBookmark(null);
      }
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openOverlay = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    history.pushState({ overlay: true }, "");
  };

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

  return (
    <div className="@container/dash mx-auto w-full max-w-6xl space-y-4 px-4 select-none">
      {selectedBookmark && (
        <BookmarkView
          bookmark={selectedBookmark}
          setBookmark={setSelectedBookmark}
        />
      )}
      <Header
        folderId={params.id}
        isLocked={data?.isLocked ?? false}
        queryKey={queryKey}
      />
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
                onThumbnailClick={openOverlay}
              />
            </Suspense>
          </CardsLayout>
          <Footer />
        </>
      )}
    </div>
  );
}
