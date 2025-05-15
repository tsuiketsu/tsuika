import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import * as React from "react";

import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
        <Link to="/register" className="[&.active]:font-bold">
          Register
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
