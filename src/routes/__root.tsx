import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { Toaster } from "sonner";

interface RootRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Toaster />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </React.Fragment>
  );
}
