import { layoutVariants } from "@/components/layouts/cards-layout";
import type { LucideIconElement } from "@/types";
import { LayoutGrid, LayoutDashboard, LayoutList } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CardsLayoutKey = keyof typeof layoutVariants;

export const cardsLayout = {
  grid: { label: "grid", icon: LayoutGrid },
  masonry: { label: "Masonry", icon: LayoutDashboard },
  compact: { label: "Compact", icon: LayoutList },
} satisfies Record<CardsLayoutKey, { label: string; icon: LucideIconElement }>;

export const cardLayout = Object.keys(cardsLayout).reduce(
  (acc, key) => {
    if (!acc) return acc;
    acc[key.toUpperCase() as keyof typeof acc] = key as CardsLayoutKey;
    return acc;
  },
  {} as Record<Uppercase<CardsLayoutKey>, CardsLayoutKey>
);

export type cardsLayoutType = (typeof cardLayout)[keyof typeof cardLayout];

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
