import NavigationBar from "./-components/navigation-bar";
import { AppSidebar } from "@/components/app-sidebar/index";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchUserSession } from "@/queries/user-session";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: DashboardLayout,
  loader: async () => {
    try {
      const session = await fetchUserSession();

      if (!session) {
        throw new Error("No session");
      }

      return { session };
    } catch {
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
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <NavigationBar />
        <div className="@container/dash flex h-full p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
