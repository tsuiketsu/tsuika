import { options, type Alphabet } from "@/constants";
import { cn } from "@/lib/utils";
import useLayoutStore, {
  cardLayout,
  type CardsLayoutKey,
} from "@/stores/layout.store";
import { getAspectRatio, getRandomAspectRatio } from "@/utils";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

const BookmarkImageFallback = ({ char }: { char: Alphabet }) => (
  <div className="@container">
    <div
      className="relative aspect-video overflow-hidden rounded-sm accent-transparent"
      style={{
        backgroundColor: options.alphabetColors[char].bg,
        color: options.alphabetColors[char].color,
      }}
    >
      <span className="font-cal-sans absolute bottom-[14%] left-[4%] size-full text-[74cqw] font-extrabold select-none">
        {char}
      </span>
    </div>
  </div>
);

interface PropsType {
  title: string;
  image: string | undefined;
  width: number | undefined;
  height: number | undefined;
  layout?: CardsLayoutKey;
}

export default function BookmarkThumbnail({
  title,
  image,
  width,
  height,
  ...props
}: PropsType) {
  const titleChar = title[0].toUpperCase() as Alphabet;
  const selectedLayout = useLayoutStore((s) => s.layout);
  const layout = props.layout ?? selectedLayout;

  const [loading, setLoading] = useState(true);
  const [aspact, setAspact] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!width || !height) {
      const randomRatio = getRandomAspectRatio();
      setAspact(randomRatio);
    } else {
      const [w, h] = getAspectRatio(width, height);
      setAspact({ width: w, height: h });
    }
  }, [width, height]);

  if (!image) {
    return <BookmarkImageFallback char={titleChar} />;
  }

  const aspectRatio = (() => {
    if (layout === cardLayout.MASONRY) {
      return loading ? Object.values(aspact).join("/") : "";
    }

    if (layout === cardLayout.COMPACT) {
      return "1/1";
    }

    return "16/9";
  })();
  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-sm", {
        "w-[24cqw]": layout === cardLayout.COMPACT,
      })}
      style={{ aspectRatio }}
    >
      <div
        className={clsx(
          "bg-background absolute inset-0 z-10 flex size-full items-center justify-center",
          { hidden: !loading }
        )}
      >
        <LoaderCircle className="animate-spin" />
      </div>
      <img
        src={image}
        alt={title}
        onLoad={() => setLoading(false)}
        loading="lazy"
        className="size-full object-cover object-top transition-all duration-700"
      />
    </div>
  );
}
