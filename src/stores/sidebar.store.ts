import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarStore {
  expandedItems: number[];
  isExpanded: (id: number) => boolean;
  updateState: (id: number, isEnabled: boolean) => void;
}

const createSidebarStore: StateCreator<SidebarStore> = (set, get) => ({
  expandedItems: [],
  isExpanded: (id) => get().expandedItems.includes(id),
  updateState: (id, isEnabled) => {
    set((state) => {
      const items = state.expandedItems;
      return {
        expandedItems: !isEnabled
          ? items.filter((item) => item !== id)
          : items.includes(id)
            ? items
            : [...items, id],
      };
    });
  },
});

const storage = {
  name: "app-sidebar",
  storage: createJSONStorage(() => localStorage),
};

export const useSidebarStore = create<SidebarStore>()(
  persist(createSidebarStore, storage)
);
