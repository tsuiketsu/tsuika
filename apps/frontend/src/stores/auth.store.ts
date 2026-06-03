import type { Session } from "@/lib/auth-client";
import { create } from "zustand";

export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | undefined;
};

type SetAuthState = {
  setIsLoading: (state: AuthState["isLoading"]) => void;
  setIsAuthenticated: (state: AuthState["isAuthenticated"]) => void;
  setSession: (session: AuthState["session"]) => void;
  flush: () => void;
};

export const authState = {
  isLoading: true,
  isAuthenticated: false,
  session: undefined,
} satisfies AuthState;

export const useAuthStore = create<AuthState & SetAuthState>((set) => ({
  ...authState,
  setIsLoading: (state) => set({ isLoading: state }),
  setIsAuthenticated: (state) => set({ isAuthenticated: state }),
  setSession: (session) => set({ session }),
  flush: () => set(authState),
}));
