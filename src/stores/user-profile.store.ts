import { updatePreferences } from "@/queries/profile.queries";
import type { Preferences, Profile } from "@/types/profile";
import { mergeOnlyUpdatedFields } from "@/utils";
import { create } from "zustand";

interface UserProfile {
  profile: Profile | undefined;
  setProfile: (value: Profile) => void;
  setPreferences: (value: Partial<Preferences>) => void;
  isFolderPinned: (id: string) => boolean;
}

export const useUserProfileStore = create<UserProfile>((set, get) => ({
  profile: undefined,
  setProfile: (profile) => set({ profile }),
  setPreferences: (pref) => {
    const prev = get().profile;

    if (prev) {
      set({
        profile: {
          ...prev,
          preferencesJson: mergeOnlyUpdatedFields(
            pref,
            prev.preferencesJson ?? {}
          ),
        },
      });
    }
  },
  isFolderPinned: (id) => {
    return !!get().profile?.preferencesJson.pinnedFolders?.includes(id);
  },
}));

export const updatePreferencesHandler = async (preferences: Preferences) => {
  const prev = useUserProfileStore.getState().profile?.preferencesJson;

  return await updatePreferences(
    mergeOnlyUpdatedFields(preferences, prev ?? {})
  );
};
