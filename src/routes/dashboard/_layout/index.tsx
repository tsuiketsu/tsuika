import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout/")({
  component: RouteComponent,
  loader: () =>
    redirect({
      to: "/dashboard/bookmarks/$slug",
      params: { slug: "/folder/unsorted" },
    }),
});

function RouteComponent() {
  return <div>Dashboard</div>;
}
