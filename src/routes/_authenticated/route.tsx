import NavigationBar from "./-components/navigation-bar";
import { AppSidebar } from "@/components/app-sidebar/index";
import ContainerSize from "@/components/dev/container-size";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { fetchUserSession } from "@/queries/user-session";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const VerificationReminder = lazy(
  () => import("./-components/verification-reminder")
);

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
  const { data, isPending } = useSession();

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <div className="sticky top-0 z-20">
          <Suspense>
            {!isPending && !data?.user.emailVerified && (
              <VerificationReminder />
            )}
          </Suspense>
          <NavigationBar />
        </div>
        <div className="@container/dash flex h-full p-4">
          <Outlet />
          <ContainerSize />
        </div>
      </div>
    </SidebarProvider>
  );
}
