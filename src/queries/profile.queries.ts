import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Preferences, Profile } from "@/types/profile";
import axios from "axios";

export const baseQuery = `${options.ApiBaseUrl}/api/v1/profiles`;

export const fetchProfile = async (): Promise<SuccessResponse<Profile>> => {
  return axios({
    method: "get",
    url: baseQuery,
    withCredentials: true,
  }).then((response) => response.data);
};

export const updatePreferences = async (payload: Preferences) => {
  return axios<SuccessResponse<Profile>>({
    method: "post",
    url: baseQuery,
    data: {
      preferencesJson: payload,
    },
    withCredentials: true,
  }).then((data) => data);
};
