import { cn } from "@/lib/utils";
import clsx, { type ClassArray } from "clsx";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface OverlayContainerProps {
  children: React.ReactNode;
  className: ClassArray;
}

interface PropsType {
  src: string;
  alt?: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
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

const diceBear = (seed: string) =>
  `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`;

const Avatar = ({ src, alt = "", fallback, className, style }: PropsType) => {
  const [isFallback, setIsFallback] = useState(!src || src.trim() === "");
  const imageRef = useRef<HTMLImageElement>(null);
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV !== "production";

  useEffect(() => {
    setIsFallback(!src || src.trim() === "");
  }, [src]);

  return (
    <div
      className={cn(
        "outline-accent relative aspect-square size-12 overflow-hidden rounded-full outline-2 outline-offset-2",
        className
      )}
      style={style}
    >
      <OverlayContainer className={[{ hidden: !isFallback }]}>
        {isDev && isFallback && fallback ? (
          <img src={diceBear(fallback)} alt="" />
        ) : (
          <span className="text-[50cqw] font-bold">
            {fallback?.substring(0, 1)}
          </span>
        )}
      </OverlayContainer>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        onError={() => setIsFallback(true)}
        className={clsx("size-full object-cover", { hidden: isFallback })}
      />
    </div>
  );
};

export default Avatar;
