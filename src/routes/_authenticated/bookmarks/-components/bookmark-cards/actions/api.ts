import {
  deleteInfQueryData,
  insertInfQueryData,
  sortInfQueryDataByDate,
  updateInfQueryData,
} from "@/lib/query.utils";
import { setBookmarkFlag } from "@/queries/bookmark.queries";
import type { Bookmark, BookmarkFlag } from "@/types/bookmark";
import { objectPick } from "@/utils";
import { QueryClient } from "@tanstack/react-query";
import type { ActionDispatch } from "react";
import { toast } from "sonner";

const getMessage = (flag: BookmarkFlag) => ({
  loading: `Setting as ${flag}`,
  success: `Successfully set bookmark as ${flag}`,
  error: `Failed to set as ${flag}`,
});

interface SetFlagProps {
  queryClient: QueryClient;
  bookmark: Bookmark;
  flag: BookmarkFlag;
  dispatch: ActionDispatch<[flag: BookmarkFlag]>;
  state: boolean;
  slug: string;
  query: string;
}

type InfiniteQueryType = { pages: { data: Bookmark[] }[] };

const handlePin = ({
  queryClient,
  bookmark,
  slug,
  query,
  dispatch,
}: Omit<SetFlagProps, "flag" | "state">) => {
  const queryKey = ["bookmarks", slug, query];

  const wasPinned = bookmark.isPinned;

  const allQueryKeys = [[...queryKey, { isPinned: true }], queryKey];

  for (const queryKey of allQueryKeys) {
    const isPinnedQuery = queryKey.some(
      (q) => typeof q === "object" && q.isPinned === true
    );

    queryClient.setQueryData<InfiniteQueryType>(queryKey, (old) => {
      // Remove from the list it currently belongs to
      if (isPinnedQuery === wasPinned) {
        return deleteInfQueryData(old, bookmark.id, (item) => item.id);
      }

      // Add to the new list
      if (isPinnedQuery === !wasPinned) {
        const newData = insertInfQueryData(old, {
          ...bookmark,
          isPinned: !wasPinned,
        });

        return sortInfQueryDataByDate(newData, (item) => item.updatedAt);
      }

      return old;
    });
  }
  dispatch("pin");
};

const handleFavourite = ({
  queryClient,
  bookmark,
  dispatch,
}: Pick<SetFlagProps, "queryClient" | "bookmark" | "dispatch">) => {
  const queryKey = ["bookmarks", "folder/favorites", ""];

  const wasFavourite = bookmark.isFavourite;

  queryClient.setQueryData<InfiniteQueryType>(queryKey, (old) =>
    wasFavourite
      ? deleteInfQueryData(old, bookmark.id, (old) => old.id)
      : insertInfQueryData(old, {
          ...bookmark,
          isFavourite: !wasFavourite,
        })
  );

  queryClient.setQueryData<InfiniteQueryType>(
    [queryKey[0], `folder/${bookmark.folderId}`, ""],
    (old) =>
      updateInfQueryData(
        old,
        { ...bookmark, isFavourite: !wasFavourite },
        (old) => old.id
      )
  );

  dispatch("favorite");
};

const handleArchive = ({
  queryClient,
  bookmark,
  slug,
  query,
  dispatch,
}: Omit<SetFlagProps, "flag" | "state">) => {
  const archivedPath = "folder/archived";
  const pathType = slug.split("/")[0];
  const wasArchived = bookmark.isArchived;

  const queryKey = [
    "bookmarks",
    slug === archivedPath ? `${pathType}/${bookmark.folderId}` : slug,
    query,
  ];

  const allQueryKeys = [queryKey, [queryKey[0], archivedPath, ""]];

  for (const key of allQueryKeys) {
    const isArchivedQuery = key[1] === "folder/archived";

    queryClient.setQueryData<InfiniteQueryType>(key, (old) => {
      // Remove from the list it currently belongs to
      if (isArchivedQuery === wasArchived) {
        return deleteInfQueryData(old, bookmark.id, (item) => item.id);
      }

      // Add to the new list
      if (isArchivedQuery === !wasArchived) {
        return insertInfQueryData(old, {
          ...bookmark,
          isArchived: !wasArchived,
        });
      }

      return old;
    });
  }

  queryClient.invalidateQueries({
    predicate: (query) => {
      const keyPart = query.queryKey[1];

      if (typeof keyPart !== "string") return false;

      if (pathType === "tag") {
        return (
          keyPart.startsWith("tag") ||
          keyPart.startsWith(`folder/${bookmark.folderId}`)
        );
      }

      return keyPart.startsWith("tag");
    },
  });

  dispatch("archive");
};

const updateQueryData = (props: Omit<SetFlagProps, "state">) => {
  switch (props.flag) {
    case "favorite":
      handleFavourite(
        objectPick(props, ["bookmark", "queryClient", "dispatch"])
      );
      break;
    case "archive":
      handleArchive({ ...props });
      break;
    case "pin":
      handlePin({ ...props });
      break;
  }
};

export const setFlag = (props: SetFlagProps) => () => {
  const { bookmark, flag, state } = props;
  const message = getMessage(flag);

  const promise = new Promise((resolve, reject) => {
    setBookmarkFlag(bookmark.id, flag, state)
      .then(({ status }) => {
        if (status === 200) {
          updateQueryData({ ...props });
          return resolve({});
        }
        return reject();
      })
      .catch((error) => {
        console.error(error);
        toast.error(message.error);
      });
  });

  toast.promise(promise, message);
};
