import { fetchProfile } from "@/queries/profile.queries";
import { useUserProfileStore } from "@/stores/user-profile.store";
import { useCallback, useEffect } from "react";

export default function UserProfileProvider() {
  const { profile: prev, setProfile } = useUserProfileStore();

  const setProfileHandler = useCallback(async () => {
    try {
      const response = await fetchProfile();

      if (!response.success) {
        console.error(response.message);
      }

      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [setProfile]);

  useEffect(() => {
    if (!prev) {
      setProfileHandler();
    }
  }, [prev, setProfileHandler]);

  return null;
}
