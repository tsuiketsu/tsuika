import { options } from "@/constants";
import type { Session } from "@/lib/auth-client";
import axios from "axios";

export const fetchUserSession = async (): Promise<Session | null> => {
  try {
    const response = await axios.get(`${options.apiBaseUrl}/api/session`, {
      withCredentials: true,
    });

    return response.data;
  } catch {
    return null;
  }
};
