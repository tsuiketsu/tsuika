import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <h1 className="text-4xl font-extrabold">Dashboard</h1>;
}
