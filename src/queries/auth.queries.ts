import { options } from "@/constants";
import type { SuccessResponse } from "@/types";
import axios from "axios";

export const baseQuery = `${options.ApiBaseUrl}/api/verification-email`;

export const getUserVerificationEmail = async (id: string) =>
  axios<SuccessResponse<{ email: string }>>({
    method: "get",
    url: `${baseQuery}/${id}`,
    withCredentials: false,
  }).then(({ data: { data } }) => data);
