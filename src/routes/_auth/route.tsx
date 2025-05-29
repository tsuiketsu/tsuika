import { fetchUserSession } from "@/queries/user-session";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: LayoutComponent,
  loader: async () => {
    try {
      const session = await fetchUserSession();
      if (session) {
        return redirect({
          to: "/bookmarks/$slug",
          params: { slug: "folder/unsorted" },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
});

function LayoutComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  );
}
