import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <h1 className="text-4xl font-extrabold">Tsuika 🔖</h1>
    </div>
  );
}
