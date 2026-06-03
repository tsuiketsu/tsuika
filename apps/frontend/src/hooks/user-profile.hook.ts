import type { ProfileFormSchema } from "@/routes/_authenticated/settings/profile";
import type { SuccessResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () =>
      await axios<SuccessResponse<ProfileFormSchema & { image: string }>>({
        method: "get",
        url: `${import.meta.env.VITE_API_BASE_URL}/api/user`,
        withCredentials: true,
      }).then(({ data: { data } }) => data),
  });
}
