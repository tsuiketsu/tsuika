import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageOffIcon } from "lucide-react";
import { useState } from "react";

interface PropsType {
  src: string | undefined;
  alt: string | undefined;
  className?: string;
}

const Fallback = ({ alt }: { alt: PropsType["alt"] }) => (
  <div className="border-foreground/20 text-muted-foreground/60 absolute flex size-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed">
    <ImageOffIcon size={40} />
    <span className="text-sm font-medium">{alt}</span>
  </div>
);

export default function Image({ src, alt = "", className }: PropsType) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div className={cn("relative aspect-video", className)} role="banner">
      {!isLoading && (!src || isError) && <Fallback alt={alt} />}
      {isLoading && (
        <div className="bg-background absolute size-full">
          <Skeleton className="size-full" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsError(true)}
        className="size-full rounded-lg object-cover select-none"
      />
    </div>
  );
}
