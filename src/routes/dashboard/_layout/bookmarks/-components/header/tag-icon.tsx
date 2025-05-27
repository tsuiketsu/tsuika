import { Skeleton } from "@/components/ui/skeleton";
import { getTextColor } from "@/utils";
import { Hash } from "lucide-react";

const TagIcon = ({
  color,
  isLoading,
}: {
  color: string | undefined;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <Skeleton className="size-9" />;
  }

  if (!color) return;

  return (
    <div
      className="relative flex size-9 items-center justify-center rounded-sm"
      style={{
        backgroundColor: color,
        color: getTextColor(color),
      }}
    >
      <Hash size={18} className="absolute" />
    </div>
  );
};

export default TagIcon;
