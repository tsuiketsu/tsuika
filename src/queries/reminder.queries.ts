import { options } from "@/constants";
import type { PaginatedSuccessResponse, SuccessResponse } from "@/types";
import type { Reminder, ReminderInsertSchema } from "@/types/reminder";
import axios from "axios";

const baseUrl = `${options.ApiBaseUrl}/api/v1/reminders`;

export const fetchReminders = async ({
  pageParam,
  limit = 5,
}: {
  pageParam: number;
  limit?: number;
}) => {
  const url = `${baseUrl}?page=${pageParam}&limit=${limit}&orderBy=desc`;

  const {
    data: { data: reminders, pagination },
    status,
  } = await axios<PaginatedSuccessResponse<Reminder[]>>({
    method: "get",
    url,
    withCredentials: true,
  });

  if (status !== 200) throw Error;

  return {
    data: reminders,
    nextCursor: pagination.hasMore ? pageParam + 1 : null,
  };
};

export const insertReminder = async ({
  contentId,
  payload,
}: {
  contentId: string;
  payload: ReminderInsertSchema;
}) => {
  return await axios<SuccessResponse<Reminder>>({
    method: "post",
    url: `${baseUrl}/${contentId}`,
    data: payload,
    withCredentials: true,
  });
};

export const updateReminder = async ({
  id,
  payload,
}: {
  id: string;
  payload: ReminderInsertSchema;
}) => {
  return await axios<SuccessResponse<Reminder>>({
    method: "put",
    url: `${baseUrl}/${id}`,
    data: payload,
    withCredentials: true,
  });
};
