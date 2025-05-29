import { cn } from "@/lib/utils";
import clsx, { type ClassArray } from "clsx";
import type React from "react";
import { useRef, useState } from "react";

interface OverlayContainerProps {
  children: React.ReactNode;
  className: ClassArray;
}

interface PropsType {
  src: string;
  fallback?: string;
  className?: string;
}

const OverlayContainer = ({ children, className }: OverlayContainerProps) => (
  <div
    className={cn(
      "@container absolute inset-0 z-10 flex items-center justify-center",
      className
    )}
  >
    {children}
  </div>
);

const Avatar = ({ src, fallback, className }: PropsType) => {
  const [isFallback, setIsFallback] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div
      className={cn(
        "outline-accent relative aspect-square size-12 overflow-hidden rounded-full outline-2 outline-offset-2",
        className
      )}
    >
      <OverlayContainer className={[{ hidden: !isFallback }]}>
        <span className="text-[30cqw] font-bold">{fallback}</span>
      </OverlayContainer>
      <img
        ref={imageRef}
        src={src}
        alt=""
        onError={() => setIsFallback(true)}
        className={clsx("size-full object-cover", { hidden: isFallback })}
      />
    </div>
  );
};

export default Avatar;
