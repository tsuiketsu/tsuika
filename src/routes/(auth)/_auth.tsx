import { fetchUserSession } from "@/queries/user-session";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth")({
  component: LayoutComponent,
  loader: async () => {
    try {
      const session = await fetchUserSession();
      if (session) {
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
    <div className="flex justify-center items-center min-h-screen">
      <Outlet />
    </div>
  );
}
