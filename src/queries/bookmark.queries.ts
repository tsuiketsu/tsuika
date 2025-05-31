import { options } from "@/constants";
import type {
  PaginatedResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
} from "@/types";
import type { Bookmark, BookmarkFormSchemaType } from "@/types/bookmark";
import axios from "axios";

const baseQuery = `${options.ApiBaseUrl}/api/v1/bookmarks`;

export const fetchBookmarks = async ({
  pageParam,
  slug,
  query = "",
}: {
  pageParam: number;
  slug?: string;
  query?: string;
}): PaginatedResponse<Bookmark[]> => {
  const slugPath = slug?.trim() ? `/${slug.trim()}` : "";
  const url = `${baseQuery}${slugPath}?query=${query}&page=${pageParam}&limit=16`;

  const {
    data: { data: bookmarks, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Bookmark[]>>({
    method: "get",
    url,
    withCredentials: true,
  });

  if (status !== 200) throw Error;

  return {
    data: bookmarks,
    nextCursor: pagination.hasMore ? pageParam + 1 : null,
  };
};

export const addBookmark = async (payload: BookmarkFormSchemaType) => {
  return await axios<SuccessResponse<Bookmark>>({
    method: "post",
    url: baseQuery,
    data: payload,
    withCredentials: true,
  });
};

export const editBookmark = async (
  id: Bookmark["id"],
  payload: BookmarkFormSchemaType
) => {
  return await axios<SuccessResponse<Bookmark>>({
    method: "put",
    url: `${baseQuery}/${id}`,
    data: payload,
    withCredentials: true,
  });
};

export const deleteBookmark = async (id: Bookmark["id"]) => {
  return await axios.delete(`${baseQuery}/${id}`, {
    withCredentials: true,
  });
};
