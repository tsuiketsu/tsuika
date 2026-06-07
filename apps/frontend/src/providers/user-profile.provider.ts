import { useCallback, useEffect } from "react";
import type { Font } from "@/components/font/context/font-context";
import { useFont } from "@/components/font/context/use-font";
import { fetchProfile } from "@/queries/profile.queries";
import { useUserProfileStore } from "@/stores/user-profile.store";

export default function UserProfileProvider() {
  const { profile: prev, setProfile } = useUserProfileStore();
  const { setFont } = useFont();

  const setProfileHandler = useCallback(async () => {
    const response = await fetchProfile();

    if (!response) {
      useUserProfileStore.setState({ isLoading: false });
      return;
    }

    setProfile(response);
    useUserProfileStore.setState({ isLoading: false });
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
        const font = profile?.preferencesJson.font;
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
