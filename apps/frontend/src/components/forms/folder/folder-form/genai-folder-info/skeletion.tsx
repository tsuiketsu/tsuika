import { Skeleton } from "@/components/ui/skeleton";

export default function GenaiFolderInfoSkeletion() {
  return (
    <div className="inline-flex w-full items-center justify-between gap-2 border-y py-4">
      <div className="flex w-full flex-col gap-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2 w-2/3" />
      </div>
      <Skeleton className="size-10 shrink-0 sm:size-8" />
    </div>
  );
}
