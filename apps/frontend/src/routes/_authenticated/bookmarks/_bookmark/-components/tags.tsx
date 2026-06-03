import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

interface PropsType {
  tags: Tag[];
  className?: string;
}

export default function TagsComponent({ tags, className }: PropsType) {
  if (tags.length === 0) return null;

  return (
    <div className={cn("bg-card mb-4 rounded-md p-3", className)}>
      <div className="inline-flex items-center gap-3">
        <span className="bg-info h-5 w-1.5 rounded-full"></span>
        <span>Tags</span>
      </div>
      <div
        className={clsx("mx-auto mt-2 flex w-full flex-wrap gap-2", {
          hidden: tags?.length === 0,
        })}
      >
        {tags?.map((tag, idx) => (
          <Button
            variant="secondary"
            size="sm"
            key={`bookmar-details-tag-${idx}`}
            className="h-7 gap-0.5 font-normal sm:h-7"
            asChild
          >
            <Link
              to="/bookmarks/$slug"
              params={{
                slug: `tag/${tag.id}`,
              }}
              className="capitalize"
            >
              {tag.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
