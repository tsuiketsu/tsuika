import type { ReactNode } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

const Fallback = () => (
  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <LoaderCircle className="animate-spin text-white" />
  </div>
);

export default function LazyBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}
