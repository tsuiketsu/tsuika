import { BookmarkSkeletons } from "./-components/bookmark-cards/skeletons";
import BookmarkContextProvider from "./-components/context/context-provider";
import BookmarksPageHeader from "./-components/header";
import SecureFolder from "./-components/secure-folder";
import ActionBar from "./-components/toolbar";
import {
  useBookmarks,
  useEncyptedBookmarks,
  usePinnedBookmarks,
} from "./-query-hooks";
import FallbackScreen from "@/components/fallback";
import { CardsLayout } from "@/components/layouts/cards-layout";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import useLayoutStore from "@/stores/layout.store";
import type { Bookmark } from "@/types/bookmark";
import { decryptBookmarks } from "@/utils/encryption.utils";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { Ghost } from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

const BookmarkCards = lazy(() => import("./-components/bookmark-cards"));

export const Route = createFileRoute("/_authenticated/bookmarks/$slug")({
  component: Bookmarks,
  loader: async ({ params }) => {
    return params;
  },
});

function Bookmarks() {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const slug = Route.useLoaderData().slug;
  const layout = useLayoutStore((s) => s.layout);

  const {
    isFetching: isFoldersFetching,
    folder: selectedSecuredFolder,
    isLocked,
    isSecured,
  } = useSecuredFolders();

  // Pinned Bookmarks
  const {
    data: pinnedData,
    fetchNextPage: fetchMorePinned,
    isFetching: isFetchingPinned,
    isFetched: isFetchedPinned,
    hasNextPage: hasMorePinned,
  } = usePinnedBookmarks({
    query,
    slug,
    enabled:
      !isSecured &&
      slug.split("/")[0] !== "tag" &&
      !["all", "archived", "unsorted", "favorites"].includes(
        slug.split("/")[1]
      ),
  });

  // Regular Bookmarks
  const {
    data,
    fetchNextPage,
    isFetching: isFetchingRegular,
    isFetched: isFetchedRegular,
    hasNextPage,
  } = useBookmarks({
    query,
    slug,
    enabled: !isSecured && !hasMorePinned,
  });

  // Encrypted Bookmarks
  const {
    data: encryptedData,
    fetchNextPage: fetchNextEncrypted,
    hasNextPage: hasMoreEncrypted,
    isFetching: isFetchingEncrypted,
    isFetched: isFetchedEncrypted,
  } = useEncyptedBookmarks({ slug, enabled: isSecured && !isLocked });

  const handleFetch = async () => {
    if (hasMorePinned && !isFetchingPinned) {
      await fetchMorePinned();
    }

    if (hasNextPage && !isFetchingRegular) {
      await fetchNextPage();
    }

    if (hasMoreEncrypted && !isFetchingEncrypted) {
      await fetchNextEncrypted();
    }
  };

  const isFetching =
    isFoldersFetching ||
    isFetchingRegular ||
    isFetchingPinned ||
    isFetchingEncrypted;

  const isFetched = isFetchedPinned || isFetchedRegular || isFetchedEncrypted;

  const isNoData =
    (pinnedData?.pages?.length ?? 0) === 0 &&
    (data?.pages?.length ?? 0) === 0 &&
    (encryptedData?.pages?.length ?? 0) === 0;

  const sneakyRef = useInfiniteScrollObserver(handleFetch, isFetching);

  const regular = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data?.pages]);

  const pinned = useMemo(() => {
    return pinnedData?.pages.flatMap((page) => page.data) ?? [];
  }, [pinnedData?.pages]);

  const combinedBookmarks = useMemo(() => {
    return [...pinned, ...regular];
  }, [pinned, regular]);

  // Bookmark decryption process
  useEffect(() => {
    if (isSecured && !isLocked) {
      (async () => {
        const data = await decryptBookmarks(encryptedData, slug);
        setBookmarks(data);
      })();
    } else {
      setBookmarks(combinedBookmarks);
    }
  }, [encryptedData, isLocked, isSecured, slug, combinedBookmarks]);

  if (!isFoldersFetching && selectedSecuredFolder && isLocked) {
    return <SecureFolder key={slug} folder={selectedSecuredFolder} />;
  }

  return (
    <div className="flex size-full flex-col">
      <div className="border-foreground/15 mb-4 space-y-6 border-b">
        <BookmarksPageHeader slug={slug} />
        <ActionBar
          slug={slug}
          total={bookmarks.length}
          onQueryChange={(value) => setQuery(value)}
        />
      </div>
      {!isFetching && isFetched && isNoData ? (
        <FallbackScreen
          title="No bookmarks found"
          description="Add a bookmark to see here"
          icon={Ghost}
        />
      ) : (
        <CardsLayout
          layout={layout}
          className={clsx("relative", { "pb-20": isFetching })}
        >
          <BookmarkContextProvider query={query}>
            <Suspense
              fallback={
                <BookmarkSkeletons
                  isLoading={true}
                  bookmarksLength={bookmarks.length ?? 9}
                />
              }
            >
              <BookmarkCards bookmarks={bookmarks} />
            </Suspense>
          </BookmarkContextProvider>
          <BookmarkSkeletons
            isLoading={isFetching}
            bookmarksLength={bookmarks.length}
          />
          <span ref={sneakyRef} className="h-1" />
        </CardsLayout>
      )}
    </div>
  );
}
