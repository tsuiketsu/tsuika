import type { Font } from "@/components/font/context/font-context";
import { useFont } from "@/components/font/context/use-font";
import { fetchProfile } from "@/queries/profile.queries";
import { useUserProfileStore } from "@/stores/user-profile.store";
import { useCallback, useEffect } from "react";

export default function UserProfileProvider() {
  const { profile: prev, setProfile } = useUserProfileStore();
  const { setFont } = useFont();

  const setProfileHandler = useCallback(async () => {
    try {
      const response = await fetchProfile();

      if (!response.success) {
        console.error(response.message);
      }

      setProfile(response.data);
      useUserProfileStore.setState({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }, [setProfile]);

  useEffect(() => {
    if (!prev) {
      setProfileHandler();
    }
  }, [prev, setProfileHandler]);

  // Apply user preferences
  useEffect(() => {
    const syncUserSettings = async () => {
      try {
        const profile = await fetchProfile();
        const font = profile.data.preferencesJson.font;
        if (font) setFont(font as Font);
      } catch (error) {
        console.error(error);
      }
    };

    if (typeof window !== "undefined" && window.sessionStorage) {
      if (!sessionStorage.getItem("vite-ui-font")) {
        syncUserSettings();
      }
    }
  }, [setFont]);

  return null;
}
