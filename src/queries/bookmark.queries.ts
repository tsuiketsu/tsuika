import { options } from "@/constants";
import type {
  PaginatedResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
} from "@/types";
import type {
  Bookmark,
  BookmarkFlag,
  BookmarkFormSchemaType,
} from "@/types/bookmark";
import type { Folder } from "@/types/folder";
import axios, { type AxiosResponse } from "axios";

const baseQuery = `${options.ApiBaseUrl}/api/v1/bookmarks`;

interface FetchBookmarksArgs {
  pageParam: number;
  slug?: string;
  query?: string;
  limit?: number;
  isPinned?: boolean;
}

export const fetchBookmarks = async ({
  pageParam,
  slug,
  query = "",
  limit = 16,
  isPinned = true,
}: FetchBookmarksArgs): PaginatedResponse<Bookmark[]> => {
  const slugPath = slug?.trim() ? `/${slug.trim()}` : "";
  const flag = `isPinned=${isPinned}`;

  let url = `${baseQuery}/?page=${pageParam}&limit=${limit}`;

  if (slugPath.split("/")?.slice(-1)?.[0] !== "all") {
    url = `${baseQuery}${slugPath}?query=${query}&page=${pageParam}&limit=${limit}`;
  }

  const {
    data: { data: bookmarks, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Bookmark[]>>({
    method: "get",
    url: `${url}&${flag}`,
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

export const bulkMoveBookmarksToFolder = async (
  folderId: Folder["id"],
  bookmarkIds: Bookmark["id"][]
) => {
  return await axios({
    method: "patch",
    url: `${baseQuery}/folder/${folderId}/bulk-assign-folder`,
    data: { bookmarkIds },
    withCredentials: true,
  });
};

export const bulkDeleteBookmarks = async (bookmarkIds: Bookmark["id"][]) => {
  return await axios<SuccessResponse<string[]>>({
    method: "delete",
    url: `${baseQuery}/bulk`,
    data: { bookmarkIds },
    withCredentials: true,
  }).then(({ data }) => data);
};

export const deleteBookmark = async (id: Bookmark["id"]) => {
  return await axios.delete(`${baseQuery}/${id}`, {
    withCredentials: true,
  });
};

export const setBookmarkFlag = async (
  bookmarkId: string,
  flagType: BookmarkFlag,
  state: boolean
): Promise<AxiosResponse> => {
  return axios({
    method: "patch",
    url: `${baseQuery}/${bookmarkId}/${flagType}`,
    withCredentials: true,
    data: { state },
  });
};
