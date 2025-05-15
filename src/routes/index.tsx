import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col gap-4 items-center justify-center">
      <h1 className="text-4xl font-extrabold">Tsuika 🔖</h1>
      <div className="w-80 grid grid-cols-2 gap-4">
        <Button variant="outline" asChild>
          <Link to="/register">Register</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
