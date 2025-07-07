import type { ShareFolderFormSchema } from "@/components/forms/folder/share-folder-form";
import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Folder } from "@/types/folder";
import axios from "axios";

export const baseQuery = `${options.ApiBaseUrl}/api/v1/shared-folders`;

export const shareFolder = async ({
  id,
  payload,
}: {
  id: Folder["id"];
  payload: ShareFolderFormSchema;
}) => {
  return axios<SuccessResponse<{ isPublic: boolean; publicId: string }>>({
    url: baseQuery,
    method: "post",
    data: Object.assign({}, payload, {
      folderId: id,
    }),
    withCredentials: true,
  });
};
