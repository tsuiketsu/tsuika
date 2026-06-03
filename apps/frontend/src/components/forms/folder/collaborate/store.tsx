import { create } from "zustand";

interface States {
  open: boolean;
  setOpen: (state: boolean) => void;
  toggleOpen: () => void;
}

export const useCollaboratorForderStore = create<States>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggleOpen: () => set((prev) => ({ open: !prev.open })),
}));
