import { deleteInfQueryData, insertInfQueryData } from "@/lib/query.utils";
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

interface SetFlatProps {
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
}: Omit<SetFlatProps, "flag" | "state">) => {
  const queryKey = ["bookmarks", slug, query];

  queryClient.setQueryData<InfiniteQueryType>(queryKey, (old) => {
    if (!old || old.pages.length === 0) {
      return;
    }

    const [firstPage, ...rest] = old.pages;

    let updatedData;

    if (!bookmark.isPinned) {
      updatedData = [
        { ...bookmark, isPinned: !bookmark.isPinned },
        ...firstPage.data.filter((b) => b.id !== bookmark.id),
      ];
    } else {
      updatedData = firstPage.data
        .map((b) =>
          b.id === bookmark.id ? { ...b, isPinned: !bookmark.isPinned } : b
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }

    return { ...old, pages: [{ ...firstPage, data: updatedData }, ...rest] };
  });

  dispatch("pin");
};

const handleFavourite = ({
  queryClient,
  bookmark,
  dispatch,
}: Pick<SetFlatProps, "queryClient" | "bookmark" | "dispatch">) => {
  const queryKey = ["bookmarks", "folder/favorites", ""];

  queryClient.setQueryData<InfiniteQueryType>(queryKey, (old) =>
    bookmark.isFavourite
      ? deleteInfQueryData(old, bookmark.id, (old) => old.id)
      : insertInfQueryData(old, {
          ...bookmark,
          isFavourite: !bookmark.isFavourite,
        })
  );
  dispatch("favorite");
};

const handleArchive = ({
  queryClient,
  bookmark,
  slug,
  query,
  dispatch,
}: Omit<SetFlatProps, "flag" | "state">) => {
  if (bookmark.isArchived) {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "bookmarks",
    });
    dispatch("archive");
    return;
  }

  let isArchived = false;

  const allQueryKeys = [
    ["bookmarks", slug, query],
    ["bookmarks", "folder/archived", ""],
  ];

  for (const queryKey of allQueryKeys) {
    queryClient.setQueryData<InfiniteQueryType>(queryKey, (old) =>
      !isArchived
        ? deleteInfQueryData(old, bookmark.id, (old) => old.id)
        : insertInfQueryData(old, {
            ...bookmark,
            isArchived: !bookmark.isArchived,
          })
    );

    isArchived = !isArchived;
  }

  const pathType = slug.split("/")[0];

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

const updateQueryData = (props: Omit<SetFlatProps, "state">) => {
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

export const setFlag = (props: SetFlatProps) => () => {
  const { bookmark, flag, state, queryClient, slug, query } = props;
  const message = getMessage(flag);
  const queryKey = ["bookmarks", slug, query];

  switch (flag) {
    case "archive": {
      queryClient.setQueryData<InfiniteQueryType>(queryKey, (old) =>
        deleteInfQueryData(old, bookmark.id, (old) => old.id)
      );

      queryClient.setQueryData<InfiniteQueryType>(queryKey, (old) =>
        insertInfQueryData(old, bookmark)
      );
      break;
    }

    default:
      break;
  }

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
