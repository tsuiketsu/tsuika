import type { ReactNode } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

const Fallback = () => (
  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <LoaderCircle className="animate-spin text-white" />
  </div>
);

interface PropsType {
  children: ReactNode;
  isVisible?: boolean;
}

const LazyBoundary = ({ children, isVisible = true }: PropsType) => {
  return isVisible && <Suspense fallback={<Fallback />}>{children}</Suspense>;
};

export default LazyBoundary;
