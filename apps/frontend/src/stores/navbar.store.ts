import type { ReactNode } from "react";
import { create } from "zustand";

export type NavbarState = {
  module: ReactNode | null;
};

type SetNavbarState = {
  setCustomModule: (component: React.ReactNode) => void;
  destroyModule: () => void;
};

export const authState = {
  module: null,
} satisfies NavbarState;

export const useNavbarStore = create<NavbarState & SetNavbarState>((set) => ({
  ...authState,
  setCustomModule: (module) => set({ module }),
  destroyModule: () => set({ module: null }),
}));
