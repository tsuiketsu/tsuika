import NotFound from "@/components/not-found";
import PWAUpdatePrompt from "@/components/pwa/update-prompt";
import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import * as React from "react";
import { Toaster } from "sonner";

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
      <Toaster />
      <Outlet />
      <PWAUpdatePrompt />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </React.Fragment>
  );
}
