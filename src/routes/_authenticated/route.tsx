import NavigationBar from "./-components/navigation-bar";
import { AppSidebar } from "@/components/app-sidebar/index";
import ContainerSize from "@/components/dev/container-size";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import UserProfileProvider from "@/providers/user-profile.provider";
import { fetchUserSession } from "@/queries/user-session";
import { useSidebarStore } from "@/stores/sidebar.store";
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

      return {
        session: {
          ...session,
          user: { ...session.user, image: session.user.image?.split("|")[1] },
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
