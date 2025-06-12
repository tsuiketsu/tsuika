import { options } from "@/constants";
import type { PaginatedSuccessResponse, SuccessResponse } from "@/types";
import type { Task, TaskInsertSchema, TaskStatus } from "@/types/task";
import axios from "axios";

const baseUrl = `${options.ApiBaseUrl}/api/v1/tasks`;

export const fetchTasks = async ({
  pageParam,
  limit = 5,
}: {
  pageParam: number;
  limit?: number;
}) => {
  const url = `${baseUrl}?page=${pageParam}&limit=${limit}&orderBy=desc`;

  const {
    data: { data: tasks, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Task[]>>({
    method: "get",
    url,
    withCredentials: true,
  });

  if (status !== 200) throw Error;

  return {
    data: tasks,
    nextCursor: pagination.hasMore ? pageParam + 1 : null,
  };
};

export const insertTask = async ({
  contentId,
  payload,
}: {
  contentId: string;
  payload: TaskInsertSchema;
}) => {
  return await axios<SuccessResponse<Task>>({
    method: "post",
    url: `${baseUrl}/${contentId}`,
    data: payload,
    withCredentials: true,
  });
};

export const updateTask = async ({
  id,
  payload,
}: {
  id: string;
  payload: TaskInsertSchema;
}) => {
  return await axios<SuccessResponse<Task>>({
    method: "put",
    url: `${baseUrl}/${id}`,
    data: payload,
    withCredentials: true,
  });
};

export const updateTaskStatus = async ({
  id,
  status,
}: {
  id: string;
  status: TaskStatus;
}) => {
  return await axios<SuccessResponse<{ id: string; status: TaskStatus }>>({
    method: "patch",
    url: `${baseUrl}/${id}?status=${status}`,
    withCredentials: true,
  });
};

export const deleteTask = async ({ id }: { id: string }) => {
  return await axios<SuccessResponse<{ deletedId: string }>>({
    method: "delete",
    url: `${baseUrl}/${id}`,
    withCredentials: true,
  });
};
