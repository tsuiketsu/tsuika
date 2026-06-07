import axios from "axios";
import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import type { Preferences, Profile } from "@/types/profile";

export const baseQuery = `${options.apiBaseUrl}/api/v1/profiles`;

export async function fetchProfile(): Promise<Profile | null> {
  try {
    const response = await fetch(baseQuery, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const result: SuccessResponse<Profile> = await response.json();

    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const updatePreferences = async (payload: Preferences) => {
  return axios<SuccessResponse<Profile>>({
    method: "post",
    url: baseQuery,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: payload,
    withCredentials: true,
  }).then((data) => data);
};
