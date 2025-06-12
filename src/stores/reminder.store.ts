import { create } from "zustand";

interface Reminder {
  id: string;
  date: string;
}

interface ReminderStore {
  list: Reminder[];
  setList: (value: Reminder[]) => void;
  add: (add: Reminder) => void;
  done: (id: string) => void;
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  list: [],
  setList: (list) => set({ list }),

  // Add Reminder
  add: (value: Reminder) => set((prev) => ({ list: [value, ...prev.list] })),

  // Remove reminder
  done: (id: string) => {
    const newList = get().list.filter((r) => r.id !== id);
    set({ list: newList });
  },
}));
