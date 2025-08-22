import NavigationBar from "./-components/navigation-bar";
import { AppSidebar } from "@/components/app-sidebar/index";
import ContainerSize from "@/components/dev/container-size";
import { useFont } from "@/components/font/context/use-font";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import UserProfileProvider from "@/providers/user-profile.provider";
import { fetchProfile } from "@/queries/profile.queries";
import { fetchUserSession } from "@/queries/user-session";
import { useSidebarStore } from "@/stores/sidebar.store";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { toast } from "sonner";

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
  const { setFont } = useFont();

  // Apply user preferences
  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const font = sessionStorage.getItem("vite-ui-font");
      if (font) return;

      const promise = new Promise((resolve, reject) => {
        (async () => {
          try {
            const profile = await fetchProfile();
            const font = profile.data.preferencesJson.font;
            if (font) setFont(font);
            resolve({});
          } catch (error) {
            reject(error);
          }
        })();
      });

      toast.promise(promise, {
        loading: "Syncing user settings...",
        success: "Success",
      });
    }
  }, [setFont]);

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
