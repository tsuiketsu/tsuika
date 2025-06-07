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
    let filteredActions = initialFlagActions;

    switch (pathType) {
      case "all":
      case "favorites":
      case "unsorted":
        filteredActions = Object.assign({}, initialFlagActions, {
          favorite: { isVisible: true },
        });
        break;
      case "archived":
        filteredActions = Object.assign({}, initialFlagActions, {
          favorite: { isVisible: true },
          archive: { isVisible: true },
        });
        break;
      default:
        filteredActions = Object.assign({}, initialFlagActions, {
          favorite: { isVisible: true },
          archive: { isVisible: true },
          pin: { isVisible: true },
        });
        break;
    }
    return filteredActions;
  })();

  const [actions, dispatch] = useReducer(
    bookmarkFlagReducer,
    Object.entries(updatedActions).reduce(
      (acc, [key, value]) => {
        const k = key as BookmarkFlag;
        acc[k] = { ...value, isActive: bookmark[value.key] };
        return acc;
      },
      {} as { [key in BookmarkFlag]: DefaultAction }
    )
  );

  return [actions, dispatch];
};
