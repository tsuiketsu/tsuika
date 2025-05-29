import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/")({
  component: Settings,
  loader: () => redirect({ to: "/settings/profile" }),
});

function Settings() {
  return <div>Hello "/_authenticated/settings/"!</div>;
}
