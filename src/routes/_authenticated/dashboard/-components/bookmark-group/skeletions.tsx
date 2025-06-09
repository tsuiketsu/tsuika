import { Skeleton } from "@/components/ui/skeleton";

interface PropsType {
  uniqueKey: string;
}

export default function BookmarkGroupListSkeletions({ uniqueKey }: PropsType) {
  return Array.from({ length: 5 }).map((_, idx) => (
    <Skeleton key={`${uniqueKey}${idx}`} className="h-10 w-full rounded-md" />
  ));
}
