import BookmarksPageHeader from "../-components/header";
import BookmarksLayout from "../-components/layouts/bookmarks-layout";
import SecureFolder from "../-components/secure-folder";
import ActionBar from "../-components/toolbar";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { fetchBookmarks } from "@/queries/bookmark.queries";
import { type Bookmark, bookmarkFilters } from "@/types/bookmark";
import { decryptBookmarks } from "@/utils/encryption.utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute(
  "/_authenticated/bookmarks/_folder/folder/s/$id"
)({
  component: Bookmarks,
  loader: async ({ params }) => {
    return params;
  },
});

function Bookmarks() {
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const folderId = Route.useLoaderData().id;

  const slug = useMemo(() => {
    return `folder/${folderId}`;
  }, [folderId]);

  const {
    isFetching: isFoldersFetching,
    folder: selectedSecuredFolder,
    isLocked,
  } = useSecuredFolders();

  const {
    data: encryptedData,
    isFetched,
    isFetching,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["bookmarks", slug, { isEncrypted: true }],
    queryFn: ({ pageParam }) =>
      fetchBookmarks({
        pageParam,
        slug,
        filter: bookmarkFilters.ENCRYPTED,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !isLocked,
  });

  // Bookmark decryption process
  useEffect(() => {
    if (!isLocked) {
      (async () => {
        const data = await decryptBookmarks(encryptedData, slug);
        setBookmarks(data);
      })();
    } else {
      setBookmarks(
        (encryptedData?.pages.flatMap((b) => b.data) ?? []) as Bookmark[]
      );
    }
  }, [encryptedData, isLocked, slug]);

  if (!isFoldersFetching && selectedSecuredFolder && isLocked) {
    return <SecureFolder key={slug} folder={selectedSecuredFolder} />;
  }

  return (
    <div className="flex size-full flex-col">
      <div className="border-foreground/15 space-y-6">
        <BookmarksPageHeader slug={slug} />
        <ActionBar
          slug={slug}
          total={bookmarks.length}
          onQueryChange={(value) => setQuery(value)}
        />
      </div>
      <hr />
      <BookmarksLayout
        isFetching={isFetching}
        isFetched={isFetched}
        isError={!!error}
        slug={slug}
        query={query}
        bookmarks={bookmarks}
        fetchNextFn={() => hasNextPage && fetchNextPage()}
      />
    </div>
  );
}
