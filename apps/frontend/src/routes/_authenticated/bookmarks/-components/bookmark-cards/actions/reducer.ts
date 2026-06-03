import { initialFlagActions } from "./constants";
import type { DefaultAction } from "./types";
import type { Bookmark, BookmarkFlag } from "@/types/bookmark";
import { useReducer, type ActionDispatch } from "react";

export function bookmarkFlagReducer(
  state: { [key in BookmarkFlag]: DefaultAction },
  flag: BookmarkFlag
) {
  return {
    ...state,
    [flag]: {
      ...state[flag],
      isActive: !state[flag].isActive,
    },
  };
}

export const useBookmarkFlagActionsReducer = (
  bookmark: Bookmark,
  slug: string
): [
  { [key in BookmarkFlag]: DefaultAction },
  ActionDispatch<[flag: BookmarkFlag]>,
] => {
  const updatedActions = (() => {
    const pathType = slug.split("/")[1];
    const visibleKeyByPath: Record<
      string,
      (keyof typeof initialFlagActions)[]
    > = {
      all: ["favorite"],
      unsorted: ["favorite"],
      archived: ["favorite", "archive"],
      default: ["favorite", "archive", "pin"],
      secured: [],
    };

    const keysToShow = visibleKeyByPath[pathType] || visibleKeyByPath.default;

    return Object.fromEntries(
      Object.entries(initialFlagActions).map(([key, value]) => [
        key,
        {
          ...value,
          isVisible: keysToShow.includes(
            key as keyof typeof initialFlagActions
          ),
        },
      ])
    );
  })();

  const [actions, dispatch] = useReducer(
    bookmarkFlagReducer,
    Object.entries(updatedActions).reduce(
      (acc, [key, value]) => {
        const k = key as BookmarkFlag;
        acc[k] = { ...value, isActive: bookmark[value.key], key: value.key };
        return acc;
      },
      {} as { [key in BookmarkFlag]: DefaultAction }
    )
  );

  return [actions, dispatch];
};
