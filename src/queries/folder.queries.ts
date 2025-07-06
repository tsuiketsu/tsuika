import { options } from "@/constants";
import type {
  PaginatedResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
} from "@/types";
import type {
  Folder,
  FolderInsertSchemaType,
  KeyDerivation,
} from "@/types/folder";
import { runDeriveKeyWorker } from "@/workers/derive-key/worker.run";
import axios from "axios";

export const baseQuery = `${options.ApiBaseUrl}/api/v1/folders`;

export const fetchFolders = async ({
  pageParam,
  limit = 30,
  folderIds,
}: {
  pageParam: number;
  limit?: number;
  folderIds?: string[];
}): PaginatedResponse<Folder[]> => {
  let url = `${baseQuery}?page=${pageParam}&limit=${limit}&orderBy=desc`;

  if (folderIds && folderIds.length > 0) {
    url = `${url}&id=${folderIds?.join("&id=")}`;
  }

  const {
    data: { data: folders, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Folder[]>>({
    method: "get",
    url,
    withCredentials: true,
  });

  if (status !== 200) throw Error;

  return {
    data: folders,
    nextCursor: pagination.hasMore ? pageParam + 1 : null,
  };
};

export const fetchTotalFoldersCount = async (): Promise<{
  total: number;
}> => {
  return await axios({
    method: "get",
    url: `${baseQuery}/total-count`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const insertFolder = async (payload: FolderInsertSchemaType) => {
  let keyDerivation: KeyDerivation | undefined;

  if (payload.isEncrypted && payload.password) {
    const data = await runDeriveKeyWorker({ password: payload.password });

    if (data.status === "success") {
      keyDerivation = data.keyMetadata;
    } else {
      throw new Error(data.message || "Key derivation failed");
    }
  }

  return await axios<SuccessResponse<Folder>>({
    method: "post",
    url: baseQuery,
    data: {
      ...payload,
      keyDerivation,
    },
    withCredentials: true,
  });
};

export const updateFolder = async (
  id: Folder["id"],
  folder: FolderInsertSchemaType
) => {
  return await axios<SuccessResponse<Folder>>({
    method: "put",
    url: `${baseQuery}/${id}`,
    data: folder,
    withCredentials: true,
  });
};

export const deleteFolder = async (id: Folder["id"]) => {
  return axios.delete(`${baseQuery}/${id}`, { withCredentials: true });
};
