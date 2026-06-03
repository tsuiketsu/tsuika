import CommandWindowComponent from "./command-window";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavbarStore } from "@/stores/navbar.store";
import { useRouterState } from "@tanstack/react-router";
import clsx from "clsx";
import { lazy, Suspense } from "react";

const DropdownOptions = lazy(() => import("./dropdown-options"));

export default function NavigationBar() {
  const {
    location: { pathname },
  } = useRouterState();

  const isMenuVisible = pathname.includes("folder") || pathname.includes("tag");
  const customModule = useNavbarStore((s) => s.module);

  return (
    <div className="bg-background shadow-background @container/n flex h-[53px] items-center gap-2 pt-2 pl-2.5 shadow-xl">
      <SidebarTrigger />
      <span className="border-foreground/10 mx-2 h-8 border @xl/n:h-6" />
      <CommandWindowComponent />
      <div className="ml-auto inline-flex space-x-2 pr-3">
        {customModule}
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
