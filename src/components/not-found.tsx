import { Button } from "./ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const msg = "This page doesn't exist or was removed!\nWe suggest you back to";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 font-medium">
      <span className="text-7xl font-extrabold">404</span>
      <pre className="font-inter text-center">{msg}</pre>
      <Button
        size="sm"
        className="w-28 rounded-full"
        onClick={() => navigate({ to: "/" })}
      >
        <ArrowRight /> home
      </Button>
    </div>
  );
}
