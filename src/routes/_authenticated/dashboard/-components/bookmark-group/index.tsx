import BookmarkList from "./list";
import BookmarkGroupListSkeletions from "./skeletions";
import FallbackScreen from "@/components/fallback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import type { LucideIconElement } from "@/types";
import type { Bookmark } from "@/types/bookmark";
import { type LinkProps } from "@tanstack/react-router";
import kebabCase from "lodash.kebabcase";
import { Ellipsis } from "lucide-react";

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
      <CardHeader className="inline-flex items-center justify-between px-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon">
            <Ellipsis size={18} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="h-full space-y-3 px-0">
        {isFetching ? (
          <BookmarkGroupListSkeletions key={kebabCase(title)} />
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
