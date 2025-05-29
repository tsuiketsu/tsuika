import { AppSidebar } from "@/components/app-sidebar/index";
import AddBookmark from "@/components/forms/bookmark/bookmark-add";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchUserSession } from "@/queries/user-session";
import {
  Outlet,
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router";

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
  const {
    location: { pathname },
  } = useRouterState();

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <div className="bg-background sticky top-0 z-20 flex h-[53px] items-center gap-2 border px-2.5">
          <SidebarTrigger />
          {/* <Input placeholder="Search" className="max-w-80" /> */}
          <div className="ml-auto inline-flex space-x-2">
            <ThemeToggle />
            <AddBookmark query={pathname} />
          </div>
        </div>
        <div className="@container/dash flex h-full p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
