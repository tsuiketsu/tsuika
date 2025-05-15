import { AppSidebar } from "@/components/app-sidebar/index";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex flex-col ">
        <div className="h-[53px] border px-2.5 items-center flex">
          <SidebarTrigger />
        </div>
        <div className="flex h-full p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
