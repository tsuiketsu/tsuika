import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar/index";
import ContainerSize from "@/components/dev/container-size";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import UserProfileProvider from "@/providers/user-profile.provider";
import { fetchUserSession } from "@/queries/user-session";
import { useAuthStore } from "@/stores/auth.store";
import { useSidebarStore } from "@/stores/sidebar.store";
import NavigationBar from "./-components/navigation-bar";

const VerificationReminder = lazy(
  () => import("./-components/verification-reminder"),
);

export const Route = createFileRoute("/_authenticated")({
  component: DashboardLayout,
  beforeLoad: async () => {
    // Get session from state instead to avoid api call spam
    if (useAuthStore.getState().isAuthenticated) {
      const session = useAuthStore.getState().session;
      return {
        session: {
          user: {
            ...session,
          },
        },
      };
    }

    const session = await fetchUserSession();

    if (!session || !session.user) {
      throw redirect({
        to: "/login",
        search: {
          error: "unauthorized",
        },
      });
    }

    useAuthStore.setState({
      isLoading: false,
      isAuthenticated: true,
      session: session,
    });

    return {
      ...session,
      user: {
        ...session.user,
      },
    };
  },
});

function DashboardLayout() {
  const { data, isPending } = useSession();
  const { open, setOpen } = useSidebarStore();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <div className="sticky top-0 z-20 pb-4">
          <Suspense>
            {!isPending && !data?.user?.emailVerified && (
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
      {!isPending && data?.user && <UserProfileProvider />}
    </SidebarProvider>
  );
}
