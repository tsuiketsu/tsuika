import { layoutVariants } from "@/components/layouts/cards-layout";
import type { LucideIconElement } from "@/types";
import { LayoutGrid, LayoutDashboard } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CardsLayoutKey = keyof typeof layoutVariants;

export const cardsLayout = {
  grid: { label: "grid", icon: LayoutGrid },
  masonry: { label: "masonry", icon: LayoutDashboard },
} satisfies Record<CardsLayoutKey, { label: string; icon: LucideIconElement }>;

export type cardsLayoutType = (typeof cardsLayout)[CardsLayoutKey];

interface LayoutStore {
  layout: CardsLayoutKey;
  setLayout: (type: CardsLayoutKey) => void;
}

const useLayoutStore = create(
  persist<LayoutStore>(
    (set) => ({
      layout: "grid",
      setLayout: (layout) => set({ layout }),
    }),
    { name: "layout-store" }
  )
);

export default useLayoutStore;
