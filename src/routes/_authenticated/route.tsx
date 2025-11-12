import NavigationBar from "./-components/navigation-bar";
import { AppSidebar } from "@/components/app-sidebar/index";
import ContainerSize from "@/components/dev/container-size";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import UserProfileProvider from "@/providers/user-profile.provider";
import { fetchUserSession } from "@/queries/user-session";
import { useAuthStore } from "@/stores/auth.store";
import { useSidebarStore } from "@/stores/sidebar.store";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const VerificationReminder = lazy(
  () => import("./-components/verification-reminder")
);

function parseImage(img: string | undefined) {
  return img?.split("|")[1];
}

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
            image: parseImage(session?.user?.image ?? undefined),
          },
        },
      };
    }

    try {
      const session = await fetchUserSession();

      if (!session) {
        throw new Error("No session");
      }

      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        session: session,
      });

      return {
        session: {
          ...session,
          user: {
            ...session.user,
            image: parseImage(session.user?.image ?? undefined),
          },
        },
      };
    } catch {
      // NOTE: As if now it's fine, but maybe implement offline token verification
      if (!navigator.onLine) return;

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
  const { open, setOpen } = useSidebarStore();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <div className="sticky top-0 z-20 pb-4">
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
      {!isPending && data?.user && <UserProfileProvider />}
    </SidebarProvider>
  );
}
