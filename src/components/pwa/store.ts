import { create } from "zustand";

export const useSWStore = create<{
  url: string | null;
  registration: ServiceWorkerRegistration | null;
}>(() => ({
  url: null,
  registration: null,
}));
