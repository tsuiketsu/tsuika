import { options } from "@/constants";
import type {
  PaginatedResponse,
  PaginatedSuccessResponse,
  SuccessResponse,
} from "@/types";
import type { Tag, TagInsertSchemaType } from "@/types/tag";
import axios from "axios";

export const baseQuery = `${options.ApiBaseUrl}/api/v1/tags`;

export const fetchAllTags = async ({
  pageParam,
}: {
  pageParam: number;
}): PaginatedResponse<Tag[]> => {
  const query = `${baseQuery}?page=${pageParam}&limit=30&orderBy=desc`;

  const {
    data: { data: tags, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Tag[]>>({
    method: "get",
    url: query,
    withCredentials: true,
  });

  if (status !== 200) throw Error;

  return {
    data: tags,
    nextCursor: pagination.hasMore ? pageParam + 1 : null,
  };
};

export const insertTag = async (payload: TagInsertSchemaType) =>
  await axios<SuccessResponse<Tag>>({
    method: "post",
    url: baseQuery,
    data: payload,
    withCredentials: true,
  });

export const updateTag = async (id: number, tag: TagInsertSchemaType) => {
  return await axios<SuccessResponse<Tag>>({
    method: "put",
    url: `${baseQuery}/${id}`,
    data: tag,
    withCredentials: true,
  });
};

export const deleteTag = async (id: number) => {
  return axios.delete(`${baseQuery}/${id}`, { withCredentials: true });
};
