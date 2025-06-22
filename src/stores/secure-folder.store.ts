import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SecureFolder = {
  folderId: string;
  key: string;
  nonce: string;
};

type SecureFolderStore = {
  folders: SecureFolder[];
  add: (v: SecureFolder) => void;
  getKey: (id: string) => string | undefined;
  getNonce: (id: string) => string | undefined;
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

  getKey: (folderId) => {
    return get().folders.find((f) => f.folderId === folderId)?.key;
  },

  getNonce: (folderId) => {
    return get().folders.find((f) => f.folderId === folderId)?.nonce;
  },
});

const storage = {
  name: "encrypted-folder",
  storage: createJSONStorage(() => sessionStorage),
};

export const useSecureFolderStore = create<SecureFolderStore>()(
  persist(createSecureFolderSlice, storage)
);
