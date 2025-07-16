import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Tag, TagInsertSchemaType } from "@/types/tag";
import axios from "axios";

export const baseQuery = `${options.ApiBaseUrl}/api/v1/tags`;

export const fetchAllTags = async () => {
  return await axios<SuccessResponse<Tag[]>>({
    method: "get",
    url: baseQuery,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const fetchTotalTagsCount = async (): Promise<{
  total: number;
}> => {
  return await axios({
    method: "get",
    url: `${baseQuery}/total-count`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};

export const insertTag = async (payload: TagInsertSchemaType) =>
  await axios<SuccessResponse<Tag>>({
    method: "post",
    url: baseQuery,
    data: payload,
    withCredentials: true,
  });

export const updateTag = async (id: Tag["id"], tag: TagInsertSchemaType) => {
  return await axios<SuccessResponse<Tag>>({
    method: "put",
    url: `${baseQuery}/${id}`,
    data: tag,
    withCredentials: true,
  });
};

export const deleteTag = async (id: Tag["id"]) => {
  return axios.delete(`${baseQuery}/${id}`, { withCredentials: true });
};

export const searchTagsByName = async (query: string) => {
  return axios<SuccessResponse<Tag[]>>({
    method: "get",
    url: `${baseQuery}/search?name=${query}&limit=5`,
    withCredentials: true,
  }).then(({ data: { data } }) => data);
};
