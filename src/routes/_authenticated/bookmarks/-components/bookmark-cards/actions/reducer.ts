import type { DefaultAction } from "./types";
import type { BookmarkFlag } from "@/types/bookmark";

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
