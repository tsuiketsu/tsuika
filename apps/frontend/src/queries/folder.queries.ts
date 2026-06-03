import type { FolderInsertSchemaType } from "@/components/forms/folder/types";
import { options } from "@/constants";
import type {
  PaginatedResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
} from "@/types";
import type { Folder, FolderSettings, KeyDerivation } from "@/types/folder";
import { encryptionPresets } from "@/utils/noble/methods.list";
import { runDeriveKeyWorker } from "@/workers/derive-key/worker.run";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const baseEndpoint = `${options.apiBaseUrl}/api/v1/folders`;

export const fetchFolders = async ({
  pageParam,
  limit = 30,
  folderIds,
}: {
  pageParam: number;
  limit?: number;
  folderIds?: string[];
}): PaginatedResponse<Folder[]> => {
  let url = `${baseEndpoint}?page=${pageParam}&limit=${limit}&orderBy=desc`;

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
    url: `${baseEndpoint}/total-count`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const insertFolder = async (payload: FolderInsertSchemaType) => {
  let keyDerivation: KeyDerivation | undefined;

  if (payload.isEncrypted && payload.password) {
    const data = await runDeriveKeyWorker({
      password: payload.password,
      encryptionMethod: encryptionPresets[payload.encryptionPreset].kdf,
    });

    if (data.status === "success") {
      keyDerivation = data.keyMetadata;
    } else {
      throw new Error(data.message || "Key derivation failed");
    }
  }

  return await axios<SuccessResponse<Folder>>({
    method: "post",
    url: baseEndpoint,
    data: {
      ...payload,
      settings: {
        keyDerivation,
        isLinkPreview: payload.isLinkPreview,
      } satisfies Partial<FolderSettings>,
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
    url: `${baseEndpoint}/${id}`,
    data: {
      ...folder,
      settings: {
        isLinkPreview: folder.isLinkPreview,
      },
    },
    withCredentials: true,
  });
};

export const deleteFolder = async (id: Folder["id"]) => {
  return axios.delete(`${baseEndpoint}/${id}`, { withCredentials: true });
};

export const getCollaborativeFolders = async () => {
  return axios({
    method: "get",
    url: `${baseEndpoint}/collabs`,
    withCredentials: true,
  });
};

export const useCollaborativeFoldersData = () => {
  return useQuery({
    queryKey: ["collab-folders"],
    queryFn: getCollaborativeFolders,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });
};
