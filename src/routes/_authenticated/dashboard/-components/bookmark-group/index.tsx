import BookmarkList from "./list";
import BookmarkGroupListSkeletons from "./skeletons";
import FallbackScreen from "@/components/fallback";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { LucideIconElement } from "@/types";
import type { Bookmark } from "@/types/bookmark";
import { type LinkProps } from "@tanstack/react-router";
import kebabCase from "lodash.kebabcase";

interface Fallback {
  title: string;
  icon: LucideIconElement;
}

interface PropsType {
  title: string;
  isFetching: boolean;
  bookmarks: Bookmark[];
  navigate?: LinkProps;
  fallback: Fallback;
}

export default function BookmarkGroup({
  title,
  isFetching,
  bookmarks,
  fallback,
}: PropsType) {
  return (
    <Card className="min-h-82 w-full gap-3 rounded-md border-none p-2 px-4 shadow-xs select-none">
      <CardHeader className="inline-flex items-center justify-between px-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full space-y-3 px-0">
        {isFetching ? (
          <BookmarkGroupListSkeletons uniqueKey={kebabCase(title)} />
        ) : bookmarks.length > 0 ? (
          <BookmarkList bookmarks={bookmarks} />
        ) : (
          <FallbackScreen
            title={fallback.title}
            description=""
            icon={fallback.icon}
            iconSize={36}
          />
        )}
      </CardContent>
    </Card>
  );
}
