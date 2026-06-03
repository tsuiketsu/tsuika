import type { ShareFolderFormSchema } from "@/components/forms/folder/share-folder-form";
import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Folder, SharedFolder } from "@/types/folder";
import type { SharedFolderData } from "@/types/public";
import axios from "axios";

export const publishFolder = async ({
  id,
  payload,
}: {
  id: Folder["id"];
  payload: ShareFolderFormSchema;
}) => {
  return axios<SuccessResponse<SharedFolder>>({
    url: `${options.apiBaseUrl}/api/v1/shared-folders`,
    method: "post",
    data: Object.assign({}, payload, {
      folderId: id,
    }),
    withCredentials: true,
  });
};

export const fetchPublicBookmarks = async (
  username: string,
  folderId: string
) => {
  return axios<SuccessResponse<SharedFolderData>>({
    method: "get",
    url: `${options.apiBaseUrl}/api/public/${username}/folder/${folderId}`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const fetchSharedFolderInfo = async (publicId: string) => {
  return axios<SuccessResponse<SharedFolder>>({
    method: "get",
    url: `${options.apiBaseUrl}/api/v1/shared-folders/${publicId}`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const unpublishFolder = async (id: string) => {
  return axios<SuccessResponse<{ id: string }>>({
    method: "patch",
    url: `${options.apiBaseUrl}/api/v1/shared-folders/${id}/unpublish`,
    withCredentials: true,
  });
};

export const unlockFolder = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}) => {
  return axios<SuccessResponse<null>>({
    method: "post",
    url: `${options.apiBaseUrl}/api/public/folder/${id}/unlock`,
    data: { password },
    withCredentials: true,
  });
};

export const relockFolder = async (id: string) => {
  return axios<SuccessResponse<null>>({
    method: "post",
    url: `${options.apiBaseUrl}/api/public/folder/${id}/lock`,
    withCredentials: true,
  });
};
