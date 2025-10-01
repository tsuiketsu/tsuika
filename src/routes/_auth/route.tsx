import type { Session, User } from "@/lib/auth-client";
import { fetchUserSession } from "@/queries/user-session";
import { useAuthStore } from "@/stores/auth.store";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
  beforeLoad: async ({ location: { pathname } }) => {
    try {
      const session: { user: User } = await fetchUserSession();

      if (!session) return;

      useAuthStore.setState({
        isAuthenticated: true,
        isLoading: false,
        session: session as unknown as Session,
      });

      if (pathname === "/email-verification" && !session.user.emailVerified) {
        return;
      } else {
        return redirect({
          to: "/",
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
