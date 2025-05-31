import { options } from "@/constants";
import axios from "axios";

export const fetchUserSession = async () => {
  try {
    const response = await axios.get(`${options.ApiBaseUrl}/api/session`, {
      withCredentials: true,
    });

    return response.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(err.message || "Failed to fetch session");
  }
};
