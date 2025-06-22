import { options } from "@/constants";
import { useSecureFolderStore } from "@/stores/secure-folder.store";
import type {
  PaginatedResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
} from "@/types";
import type {
  Bookmark,
  BookmarkFlag,
  BookmarkFilter,
  BookmarkFormSchemaType,
} from "@/types/bookmark";
import type { Folder } from "@/types/folder";
import { LibSodium } from "@/utils/libsodium";
import axios, { type AxiosResponse } from "axios";

const baseQuery = `${options.ApiBaseUrl}/api/v1/bookmarks`;

interface FetchBookmarksArgs {
  pageParam: number;
  slug?: string;
  query?: string;
  limit?: number;
  filter?: BookmarkFilter;
}

export const fetchBookmarks = async ({
  pageParam,
  slug,
  query = "",
  limit = 16,
  filter,
}: FetchBookmarksArgs): PaginatedResponse<Bookmark[]> => {
  const slugPath = slug?.trim() ? `/${slug.trim()}` : "";

  let url = `${baseQuery}/?page=${pageParam}&limit=${limit}`;

  if (slugPath.split("/")?.slice(-1)?.[0] !== "all") {
    url = `${baseQuery}${slugPath}?query=${query}&page=${pageParam}&limit=${limit}`;
  }

  const {
    data: { data: bookmarks, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Bookmark[]>>({
    method: "get",
    url: `${url}&filter=${filter ?? ""}`,
    withCredentials: true,
  });

  if (status !== 200) throw Error;

  return {
    data: bookmarks,
    nextCursor: pagination.hasMore ? pageParam + 1 : null,
  };
};

export const fetchRecentBookmarks = async (): Promise<Bookmark[]> => {
  return await axios({
    method: "get",
    url: `${baseQuery}?limit=5`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const fetchTotalBookmarksCount = async (
  filter?: "pinned" | "archived" | "favorites"
): Promise<{
  total: number;
}> => {
  let url = `${baseQuery}/total-count`;

  if (filter) {
    url = `${url}?filter=${filter}`;
  }
  return await axios({
    method: "get",
    url,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const addBookmark = async (payload: BookmarkFormSchemaType) => {
  let _payload = payload;

  if (_payload.isEncrypted && _payload.folderId) {
    const crypt = await new LibSodium().initialize();
    const key = useSecureFolderStore.getState().getKey(_payload.folderId);
    const nonce = useSecureFolderStore.getState().getNonce(_payload.folderId);

    if (key && nonce) {
      const encrypt = (str: string | undefined) => {
        return str && str.trim() !== ""
          ? crypt.encrypt(str, { key, nonce })?.ciphertext
          : undefined;
      };

      const { url, title, description, thumbnail } = _payload;

      _payload = {
        ..._payload,
        url: encrypt(url) as string,
        title: encrypt(title || "Untitled"),
        description: encrypt(description),
        thumbnail: encrypt(thumbnail),
      };
    }
  }

  return await axios<SuccessResponse<Bookmark>>({
    method: "post",
    url: baseQuery,
    data: _payload,
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
