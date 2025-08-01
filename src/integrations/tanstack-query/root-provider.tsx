import { createIDBPersister } from "./persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import type React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      networkMode: "offlineFirst",
      retry: 0,
    },
  },
});

const persister = createIDBPersister("tsuika");

// eslint-disable-next-line react-refresh/only-export-components
export function getContext() {
  return {
    queryClient,
  };
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
