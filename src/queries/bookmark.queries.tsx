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
}: {
  pageParam: number;
  slug?: string;
}): PaginatedResponse<Bookmark[]> => {
  let query = "";

  if (slug && slug.trim() !== "") {
    query = `${baseQuery}/${slug}?page=${pageParam}&limit=16`;
  } else {
    query = `${baseQuery}?page=${pageParam}&limit=16`;
  }

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

export const addBookmark = async (payload: BookmarkFormSchemaType) => {
  return await axios<SuccessResponse<Bookmark>>({
    method: "post",
    url: baseQuery,
    data: payload,
    withCredentials: true,
  });
};

export const editBookmark = async (
  id: number,
  payload: BookmarkFormSchemaType
) => {
  return await axios<SuccessResponse<Bookmark>>({
    method: "put",
    url: `${baseQuery}/${id}`,
    data: payload,
    withCredentials: true,
  });
};
export const deleteBookmark = async (id: number) => {
  return await axios.delete(`${baseQuery}/${id}`, {
    withCredentials: true,
  });
};
