import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Collaborator, UserRole } from "@/types/folder";
import axios from "axios";

const baseEndpoint = `${options.apiBaseUrl}/api/v1/collab-folders`;

export interface CollabFolderInsert {
  identifier: string;
  role: UserRole;
  folderId: string;
}

export const addUserToFolder = async (payload: CollabFolderInsert) => {
  return axios<SuccessResponse<unknown>>({
    method: "post",
    url: baseEndpoint,
    data: {
      identifier: payload.identifier,
      folderPublicId: payload.folderId,
      permissionLevel: payload.role,
    },
    withCredentials: true,
  });
};

export const getCollaborators = async (folderId: string) => {
  return axios<SuccessResponse<Collaborator[]>>({
    method: "get",
    url: `${baseEndpoint}/${folderId}`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};
