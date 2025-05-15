import {
  Link,
  Outlet,
  createRootRoute,
  useNavigate,
} from "@tanstack/react-router";
import * as React from "react";

import { signOut } from "@/lib/auth-client";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();

  const logOut = async () => {
    await signOut().then(({ error }) => {
      if (!error) {
        navigate({ to: "/login" });
      }
    });
  };

  return (
    <React.Fragment>
      <Toaster />
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
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
        <button type="button" onClick={logOut}>
          Logout
        </button>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
