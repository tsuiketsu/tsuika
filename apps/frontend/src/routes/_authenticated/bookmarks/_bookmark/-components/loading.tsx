import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const tagSkeletons = Array.from({ length: 5 }).map((_, idx) => (
    <Skeleton className="h-6 w-18" key={`tag-skeletons-${idx}`} />
  ));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center space-y-6">
      <Skeleton className="aspect-video w-full" />
      <div className="w-full space-y-2">
        <Skeleton className="mx-auto h-8 w-11/12" />
        <Skeleton className="mx-auto h-8 w-9/12" />
      </div>
      <div className="inline-flex w-full max-w-3/4 flex-wrap justify-center gap-1">
        {tagSkeletons}
      </div>
      <div className="w-full space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
