import { options } from "@/constants";
import type {
  PaginatedResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
} from "@/types";
import type { Bookmark, BookmarkInsertSchema } from "@/types/bookmark";
import type { type } from "arktype";
import axios from "axios";

export const fetchBookmarks = async ({
  pageParam,
}: { pageParam: number }): PaginatedResponse<Bookmark[]> => {
  const query = `${options.ApiBaseUrl}/api/v1/bookmarks?page=${pageParam}&limit=16`;

  const {
    data: { data: bookmarks, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Bookmark[]>>({
    method: "get",
    url: query,
    withCredentials: true,
  });

  if (status !== 200) throw Error;

  return {
    data: bookmarks,
    nextCursor: pagination.hasMore ? pageParam + 1 : null,
  };
};

export const addBookmark = async (
  payload: type.infer<typeof BookmarkInsertSchema>,
) => {
  return await axios<SuccessResponse<Bookmark>>({
    method: "post",
    url: `${options.ApiBaseUrl}/api/v1/bookmarks`,
    data: payload,
    withCredentials: true,
  });
};

export const editBookmark = () => {};
export const deleteBookmark = () => {};
