import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouterState } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const DropdownOptions = lazy(() => import("./dropdown-options"));

export default function NavigationBar() {
  const {
    location: { pathname },
  } = useRouterState();

  const isMenuVisible = pathname.includes("folder") || pathname.includes("tag");

  return (
    <div className="bg-background flex h-[53px] items-center gap-2 px-2.5 pt-2">
      <SidebarTrigger />
      <div className="ml-auto inline-flex space-x-2">
        <ThemeToggle />
        <Suspense>{isMenuVisible && <DropdownOptions />}</Suspense>
      </div>
    </div>
  );
}
