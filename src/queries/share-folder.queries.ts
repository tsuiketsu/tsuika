import type { ShareFolderFormSchema } from "@/components/forms/folder/share-folder-form";
import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Folder, SharedFolder } from "@/types/folder";
import type { SharedFolderData } from "@/types/public";
import axios from "axios";

export const shareFolder = async ({
  id,
  payload,
}: {
  id: Folder["id"];
  payload: ShareFolderFormSchema;
}) => {
  return axios<SuccessResponse<{ isPublic: boolean; publicId: string }>>({
    url: `${options.ApiBaseUrl}/api/v1/shared-folders`,
    method: "post",
    data: Object.assign({}, payload, {
      folderId: id,
    }),
    withCredentials: true,
  });
};

export const fetchPublicBookmarks = async (folderId: string) => {
  return axios<SuccessResponse<SharedFolderData>>({
    method: "get",
    url: `${options.ApiBaseUrl}/api/public/folder/${folderId}`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const fetchSharedFolderInfo = async (publicId: string) => {
  return axios<SuccessResponse<SharedFolder>>({
    method: "get",
    url: `${options.ApiBaseUrl}/api/v1/shared-folders/${publicId}`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const unpublishFolder = async (id: string) => {
  return axios<SuccessResponse<{ id: string }>>({
    method: "patch",
    url: `${options.ApiBaseUrl}/api/v1/shared-folders/${id}`,
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
    url: `${options.ApiBaseUrl}/api/public/folder/${id}/unlock`,
    data: { password },
    withCredentials: true,
  });
};
