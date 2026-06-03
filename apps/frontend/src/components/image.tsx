import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageOffIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface PropsType {
  src: string | undefined;
  alt: string | undefined;
  className?: string;
  fallbackSrc?: string;
}

const Fallback = ({ alt }: { alt: PropsType["alt"] }) => (
  <div className="border-foreground/20 text-muted-foreground/60 absolute flex size-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed">
    <ImageOffIcon size={40} />
    <span className="text-sm font-medium">{alt}</span>
  </div>
);

export default function Image({
  src,
  fallbackSrc,
  alt = "",
  className,
}: PropsType) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setIsError(false);
  }, [src]);

  const handleError = () => {
    setIsLoading(false);

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
    } else {
      setIsError(true);
    }
  };

  return (
    <div className={cn("relative aspect-video", className)} role="banner">
      {isError || !currentSrc?.trim() ? (
        <Fallback alt={alt} />
      ) : isLoading ? (
        <div className="bg-background absolute size-full">
          <Skeleton className="size-full" />
        </div>
      ) : null}

      {src && (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          className="size-full rounded-lg object-cover text-transparent select-none"
        />
      )}
    </div>
  );
}
