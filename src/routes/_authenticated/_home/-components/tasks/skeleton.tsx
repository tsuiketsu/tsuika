import { Skeleton } from "@/components/ui/skeleton";

export default function TaskItemSkeletion() {
  return (
    <div className="relative flex h-25 w-full flex-col justify-between rounded-md border p-2">
      <div className="flex w-full gap-4">
        <Skeleton className="size-10 shrink-0" />
        <div className="w-full space-y-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-2/4" />
        </div>
      </div>
      <div className="flex items-end">
        <Skeleton className="h-5 w-32" />
        <div className="ml-auto inline-flex gap-2">
          <Skeleton className="size-6" />
          <Skeleton className="size-6" />
          <Skeleton className="size-6" />
        </div>
      </div>
      <Skeleton className="absolute top-2 right-2 size-4 rounded-xs" />
    </div>
  );
}
