import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Collaborator, UserRole } from "@/types/folder";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseEndpoint = `${options.apiBaseUrl}/api/v1/collab-folders`;

export function invalidateCollaboratorsData(
  queryClient: QueryClient,
  folderId: string
) {
  queryClient.invalidateQueries({
    queryKey: ["get-collaborators", { folderId }],
  });
}

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

export const useGetCollaboratorsQuery = (folderId: string) => {
  return useQuery({
    queryKey: ["get-collaborators", { folderId }],
    queryFn: () => getCollaborators(folderId),
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });
};

export const changeMemberRole = async (payload: CollabFolderInsert) => {
  return axios<
    SuccessResponse<{
      id: string;
      permissionLevel: Collaborator["permissionLevel"];
    }>
  >({
    method: "patch",
    url: `${baseEndpoint}/${payload.folderId}`,
    data: {
      identifier: payload.identifier,
      permissionLevel: payload.role,
    },
    withCredentials: true,
  }).then(({ data }) => data);
};
