import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { SharedFolderData } from "@/types/public";
import clsx from "clsx";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const ph =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrWCfadBOtUGta1YeOfW9xdamAgKFV3ZPI3Q&s";

const PublicDetailsSkeletion = () => (
  <div className="mx-auto flex w-full flex-col items-center space-y-4 border-b pt-30 pb-4">
    <Skeleton className="size-26 rounded-full" />
    <Skeleton className="h-11 w-full max-w-lg" />
    <Skeleton className="h-6 w-full max-w-32" />
    <Skeleton className="h-6 w-full max-w-68" />
    <div className="flex h-36 w-full max-w-2xl flex-col justify-between gap-3 rounded-xl border p-3">
      <Skeleton className="h-full w-full" />
      <div className="inline-flex w-full items-end justify-between">
        <Skeleton className="h-5 w-full max-w-38" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  </div>
);

const Note = ({ authorName, note }: { authorName: string; note: string }) => {
  const [isClamped, setIsClamped] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  const getLineClamp = useCallback(() => {
    return note && pRef.current && pRef.current.scrollHeight > 72;
  }, [note]);

  useEffect(() => {
    if (getLineClamp()) {
      setIsClamped(true);
    }
  }, [getLineClamp]);

  return (
    <div className="bg-card w-full max-w-2xl space-y-3 rounded-xl border p-3 transition">
      <p ref={pRef} className={clsx({ "line-clamp-3": isClamped })}>
        {note}
      </p>
      <div className="flex items-end justify-between">
        <span className="text-muted-foreground text-xs">
          Note for you by <b>{authorName}</b>
        </span>
        <Button
          variant="link"
          size="sm"
          className={clsx("ml-auto", { hidden: !getLineClamp() })}
          onClick={() => setIsClamped((prev) => !prev)}
        >
          Read More
          <ChevronDownIcon
            className={clsx("transition-transform duration-300", {
              "rotate-180": !isClamped,
            })}
          />
        </Button>
      </div>
    </div>
  );
};

interface PropsType {
  isFetching: boolean;
  data: SharedFolderData | undefined;
}

export default function PublicDetails({ isFetching, data }: PropsType) {
  if (isFetching) {
    return <PublicDetailsSkeletion />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full flex-col items-center space-y-4 border-b pt-30 pb-4">
      <Avatar src={ph} className="size-26" />
      <h1 className="max-w-xl text-center text-5xl font-bold">
        This is a big title, must be something important
      </h1>
      <span className="text-lg">
        by <b>{data?.author.name || data?.author.username}</b>
      </span>
      <span className="text-muted-foreground font-medium">
        Updated at{" "}
        {data?.updatedAt &&
          format(new Date(data?.createdAt ?? ""), "dd MMMM, yyyy 'at' HH:MM")}
      </span>
      <Note
        authorName={data?.author.name ?? data?.author.username ?? ""}
        note={data?.note}
      />
    </div>
  );
}
