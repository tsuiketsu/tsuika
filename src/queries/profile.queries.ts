import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Preferences, Profile } from "@/types/profile";
import axios from "axios";

export const baseQuery = `${options.ApiBaseUrl}/api/v1/profiles`;

export const fetchProfile = async () => {
  return axios
    .get<SuccessResponse<Profile>>(baseQuery)
    .then(({ data: { data } }) => data);
};

export const updatePreferences = async (payload: Preferences) => {
  return axios<SuccessResponse<Profile>>({
    method: "post",
    url: baseQuery,
    data: {
      preferencesJson: payload,
    },
    withCredentials: true,
  });
};
