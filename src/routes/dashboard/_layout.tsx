import { AppSidebar } from "@/components/app-sidebar/index";
import AddBookmark from "@/components/forms/bookmark/bookmark-add";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchUserSession } from "@/queries/user-session";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout")({
  component: DashboardLayout,
  loader: async () => {
    try {
      const session = await fetchUserSession();
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
      <div className="w-full flex flex-col ">
        <div className="h-[53px] border sticky top-0 z-10 bg-background px-2.5 items-center flex gap-3">
          <SidebarTrigger />
          <Input placeholder="Search" className="max-w-96" />
          <AddBookmark />
        </div>
        <div className="flex h-full p-4 @container/dash">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
