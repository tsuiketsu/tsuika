import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchUserSession } from "@/queries/user-session";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
  beforeLoad: async () => {
    const session = await fetchUserSession();

    if (session?.user) {
      throw redirect({ to: "/" });
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
