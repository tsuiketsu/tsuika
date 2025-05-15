import { fetchUserSession } from "@/queries/user-session";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout")({
  component: DashboardLayout,
  loader: async () => {
    try {
      const session = await fetchUserSession();
      return { session };
    } catch (error) {
      throw redirect({
        to: "/login",
        search: {
          error: "unauthorized",
        },
      });
    }
  },
});

function DashboardLayout() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Outlet />
    </div>
  );
}
