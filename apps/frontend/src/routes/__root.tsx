import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import * as React from "react";
import { Toaster } from "sonner";
import NotFound from "@/components/not-found";
import PWAUpdatePrompt from "@/components/pwa/update-prompt";

interface RootRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Toaster position="top-center" />
      <Outlet />
      <PWAUpdatePrompt />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </React.Fragment>
  );
}
