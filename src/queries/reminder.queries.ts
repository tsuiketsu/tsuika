import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Reminder, ReminderInsertSchema } from "@/types/remidner";
import axios from "axios";

const baseUrl = `${options.ApiBaseUrl}/api/v1/reminders`;

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
