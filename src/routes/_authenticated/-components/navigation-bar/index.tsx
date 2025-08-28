import CommandWindow from "../command-window";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import useCmdkToggle from "@/hooks/cmdk-toggle.hook";
import { useRouterState } from "@tanstack/react-router";
import clsx from "clsx";
import { CommandIcon, SearchIcon } from "lucide-react";
import { lazy, Suspense } from "react";

const DropdownOptions = lazy(() => import("./dropdown-options"));

const CommandWindowComponent = () => {
  const [open, setOpen] = useCmdkToggle();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden w-58 justify-between pr-1 pl-2 shadow-sm hover:bg-inherit @xl/n:inline-flex"
        onClick={() => setOpen(true)}
      >
        <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
          <SearchIcon size={18} />
          Search...
        </span>
        <Badge variant="secondary" className="gap-1">
          <CommandIcon style={{ width: 13 }} /> <span>+</span> <span>k</span>
        </Badge>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="@xl/n:hidden"
      >
        <CommandIcon />
      </Button>
      <CommandWindow open={open} setOpen={setOpen} />
    </>
  );
};

export default function NavigationBar() {
  const {
    location: { pathname },
  } = useRouterState();

  const isMenuVisible = pathname.includes("folder") || pathname.includes("tag");

  return (
    <div className="bg-background shadow-background @container/n flex h-[53px] items-center gap-2 pt-2 pl-2.5 shadow-xl">
      <SidebarTrigger />
      <span className="border-foreground/10 mx-2 h-8 border @xl/n:h-6" />
      <CommandWindowComponent />
      <div className="ml-auto inline-flex space-x-2 pr-3">
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
