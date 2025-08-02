import type { User } from "@/lib/auth-client";
import { fetchUserSession } from "@/queries/user-session";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
  loader: async ({ location: { pathname } }) => {
    try {
      const session: { user: User } = await fetchUserSession();
      if (!session) return;

      if (pathname === "/email-verification" && !session.user.emailVerified) {
        return;
      } else {
        return redirect({
          to: "/dashboard",
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
});

function LayoutComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  );
}
