import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SecureFolder = {
  folderId: string;
  key: string;
};

type SecureFolderStore = {
  folders: SecureFolder[];
  add: (v: SecureFolder) => void;
  getKey: (id: string) => string | undefined;
  removeKey: (id: string) => void;
};

const createSecureFolderSlice: StateCreator<SecureFolderStore> = (
  set,
  get
) => ({
  folders: [],

  add: (v) => {
    const prev = get().folders;

    if (!prev.some((f) => f.folderId === v.folderId)) {
      set({ folders: [...prev, v] });
    }
  },

  getKey: (id) => {
    return get().folders.find((f) => f.folderId === id)?.key;
  },

  removeKey: (id) => {
    set((prev) => ({
      folders: prev.folders.filter((f) => f.folderId !== id),
    }));
  },
});

const storage = {
  name: "encrypted-folder",
  storage: createJSONStorage(() => sessionStorage),
};

export const useSecureFolderStore = create<SecureFolderStore>()(
  persist(createSecureFolderSlice, storage)
);
