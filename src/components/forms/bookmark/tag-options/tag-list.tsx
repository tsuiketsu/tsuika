import { getTextColor } from "@/utils";
import { Hash } from "lucide-react";

const TagList = ({
  tags,
}: {
  tags: { id: number; name: string; color: string }[] | undefined;
}) => (
  <div className="flex flex-wrap gap-2">
    {tags?.map((tag, idx) => (
      <span
        key={`selected-tag-${idx}`}
        className="font-roboto inline-flex items-center rounded-full px-2 py-0.5 text-sm"
        style={{
          backgroundColor: tag.color,
          color: getTextColor(tag.color),
        }}
      >
        <Hash size={14} />
        {tag.name}
      </span>
    ))}
  </div>
);

export default TagList;
