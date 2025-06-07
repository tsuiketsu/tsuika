import { create } from "zustand";

interface ToolbarStore {
  isBulkEdit: boolean;
  toggleBulkEdit: () => void;

  bookmarkIds: string[];
  addBookmarkId: (id: string) => void;
}

export const useToolbarStore = create<ToolbarStore>((set, get) => ({
  isBulkEdit: false,
  toggleBulkEdit: () => {
    if (!get().isBulkEdit) {
      set({ bookmarkIds: [] });
    }

    set((prev) => ({ isBulkEdit: !prev.isBulkEdit }));
  },

  bookmarkIds: [],
  addBookmarkId: (id) => {
    const ids = get().bookmarkIds;

    if (!ids.includes(id)) {
      set({ bookmarkIds: [...ids, id] });
      return;
    }

    set({ bookmarkIds: ids.filter((bid) => bid !== id) });
  },
}));
