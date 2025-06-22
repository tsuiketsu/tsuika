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
  let keyDerivation: KeyDerivation | null = null;

  if (payload.isEncrypted && payload.password) {
    const { LibSodium } = await import("@/utils/libsodium");
    const crypto = await new LibSodium().initialize();
    const { mac, salt, opslimit, memlimit, algorithm } = crypto.deriveKey({
      password: payload.password,
    });

    keyDerivation = {
      mac: crypto.toBase64(mac),
      salt: crypto.toBase64(salt),
      nonce: crypto.toBase64(crypto.generateNonce()),
      kdf_opslimit: opslimit,
      kdf_memlimit: memlimit,
      kdf_algorithm: algorithm,
    };
  }

  return await axios<SuccessResponse<Folder>>({
    method: "post",
    url: baseQuery,
    data: { ...payload, keyDerivation },
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
