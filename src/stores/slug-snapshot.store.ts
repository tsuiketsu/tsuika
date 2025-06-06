import { create } from "zustand";

interface Snapshot {
  id: string;
  slug: string;
}

interface SlugSnapshotStore {
  snapshots: Snapshot[];

  getById: (id: string) => Snapshot | undefined;
  add: (snapshot: Snapshot) => void;
  remove: (id: string) => void;
}

export const useSlugSnapshotStore = create<SlugSnapshotStore>((set, get) => ({
  snapshots: [],

  getById: (id) => get().snapshots.find((s) => s.id === id),

  add: (snapshot) => {
    set((state) => ({
      snapshots: [...state.snapshots, snapshot],
    }));
  },

  remove: (id) => {
    set((state) => ({
      snapshots: state.snapshots.filter((s) => s.id !== id),
    }));
  },
}));
