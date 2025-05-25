import { options, type Alphabet } from "@/constants";

const BookmarkImageFallback = ({ char }: { char: Alphabet }) => (
  <div
    className="@container relative overflow-hidden rounded-sm accent-transparent"
    style={{
      aspectRatio: "5/3",
      backgroundColor: options.alphabetColors[char].bg,
      color: options.alphabetColors[char].color,
    }}
  >
    <span className="font-cal-sans absolute bottom-[14%] left-[4%] size-full text-[74cqw] font-extrabold select-none">
      {char}
    </span>
  </div>
);

interface PropsType {
  image: string | undefined;
  title: string;
}

export default function BookmarkThumbnail({ image, title }: PropsType) {
  const titleChar = title[0].toUpperCase() as Alphabet;

  if (!image) {
    return <BookmarkImageFallback char={titleChar} />;
  }

  return (
    <div className="aspect-video overflow-hidden rounded-sm border">
      <img
        src={image}
        alt={title}
        className="size-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm group-hover:grayscale-100"
      />
    </div>
  );
}
