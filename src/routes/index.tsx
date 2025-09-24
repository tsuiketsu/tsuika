import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});

function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
