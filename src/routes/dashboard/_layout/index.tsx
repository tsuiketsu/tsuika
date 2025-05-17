import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout/")({
  component: RouteComponent,
  loader: () => redirect({ to: "/dashboard/bookmarks" }),
});

function RouteComponent() {
  return <div>Dashboard</div>;
}
