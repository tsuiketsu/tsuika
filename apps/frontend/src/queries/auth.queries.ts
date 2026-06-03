import { options } from "@/constants";
import type { ProfileFormSchema } from "@/routes/_authenticated/settings/profile";
import type { SuccessResponse } from "@/types";
import axios from "axios";

export const baseQuery = `${options.apiBaseUrl}/api`;

export const getUserVerificationEmail = async (id: string) =>
  axios<SuccessResponse<{ email: string }>>({
    method: "get",
    url: `${baseQuery}/verification-email/${id}`,
    withCredentials: false,
  }).then(({ data: { data } }) => data);

export const updateUserProfile = async (payload: ProfileFormSchema) => {
  return axios<SuccessResponse<ProfileFormSchema & { image: string }>>({
    method: "patch",
    url: `${baseQuery}/user`,
    data: payload,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  }).then(({ data }) => data);
};
