import { options } from "@/constants";
import type {
  PaginatedResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
} from "@/types";
import type { Folder, FolderInsertSchemaType } from "@/types/folder";
import axios from "axios";

export const baseQuery = `${options.ApiBaseUrl}/api/v1/folders`;

export const fetchFolders = async ({
  pageParam,
  limit = 30,
}: {
  pageParam: number;
  limit?: number;
}): PaginatedResponse<Folder[]> => {
  const query = `${baseQuery}?page=${pageParam}&limit=${limit}&orderBy=desc`;

  const {
    data: { data: folders, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Folder[]>>({
    method: "get",
    url: query,
    withCredentials: true,
  });

  if (status !== 200) throw Error;

  return {
    data: folders,
    nextCursor: pagination.hasMore ? pageParam + 1 : null,
  };
};

export const insertFolder = async (payload: FolderInsertSchemaType) =>
  await axios<SuccessResponse<Folder>>({
    method: "post",
    url: baseQuery,
    data: payload,
    withCredentials: true,
  });

export const updateFolder = async (
  id: number,
  folder: FolderInsertSchemaType
) => {
  return await axios<SuccessResponse<Folder>>({
    method: "put",
    url: `${baseQuery}/${id}`,
    data: folder,
    withCredentials: true,
  });
};

export const deleteFolder = async (id: number) => {
  return axios.delete(`${baseQuery}/${id}`, { withCredentials: true });
};
