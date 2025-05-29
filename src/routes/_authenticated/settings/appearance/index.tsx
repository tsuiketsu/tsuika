import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/appearance/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/settings/appearance/"!</div>;
}
