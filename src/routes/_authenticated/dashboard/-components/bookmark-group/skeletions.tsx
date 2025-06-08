import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarkGroupListSkeletions({ key }: { key: string }) {
  return Array.from({ length: 5 }).map((_, idx) => (
    <Skeleton key={`${key}${idx}`} className="h-10 w-full rounded-md" />
  ));
}
