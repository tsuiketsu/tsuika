import { AppSidebar } from "@/components/app-sidebar/index";
import AddBookmark from "@/components/forms/bookmark/bookmark-add";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchUserSession } from "@/queries/user-session";
import useLayoutStore, {
  cardsLayout,
  type CardsLayoutKey,
} from "@/stores/layout.store";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/dashboard/_layout")({
  component: DashboardLayout,
  loader: async ({ params }: { params: { slug: string } }) => {
    try {
      const session = await fetchUserSession();
      return { session, slug: params.slug };
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

const LayoutPicker = () => {
  const value = useLayoutStore((s) => s.layout);
  const setValue = useLayoutStore((s) => s.setLayout);
  const Icon = cardsLayout?.[value]?.icon ?? LayoutGrid;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon">
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(cardsLayout).map(([key, value]) => (
          <DropdownMenuItem
            className="capitalize"
            onClick={() => setValue(key as CardsLayoutKey)}
          >
            {value.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function DashboardLayout() {
  const slug = Route.useLoaderData().slug;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <div className="bg-background sticky top-0 z-20 flex h-[53px] items-center gap-2 border px-2.5">
          <SidebarTrigger />
          {/* <Input placeholder="Search" className="max-w-80" /> */}
          <div className="ml-auto inline-flex space-x-2">
            <LayoutPicker />
            <ThemeToggle />
            <AddBookmark query={slug} />
          </div>
        </div>
        <div className="@container/dash flex h-full p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
