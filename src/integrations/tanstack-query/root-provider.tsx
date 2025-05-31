import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export function getContext() {
  return {
    queryClient,
  };
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
