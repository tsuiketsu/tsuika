import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouterState } from "@tanstack/react-router";
import clsx from "clsx";
import { lazy, Suspense } from "react";

const DropdownOptions = lazy(() => import("./dropdown-options"));

export default function NavigationBar() {
  const {
    location: { pathname },
  } = useRouterState();

  const isMenuVisible = pathname.includes("folder") || pathname.includes("tag");

  return (
    <div className="bg-background shadow-background flex h-[53px] items-center gap-2 pt-2 pl-2.5 shadow-xl">
      <SidebarTrigger />
      <div className="ml-auto inline-flex space-x-2 pr-4">
        <ThemeToggle />
        {isMenuVisible && (
          <Suspense
            fallback={
              <Skeleton
                className={clsx(
                  "rounded-md",
                  buttonVariants({ variant: "secondary", size: "icon" })
                )}
              />
            }
          >
            <DropdownOptions />
          </Suspense>
        )}
      </div>
    </div>
  );
}
