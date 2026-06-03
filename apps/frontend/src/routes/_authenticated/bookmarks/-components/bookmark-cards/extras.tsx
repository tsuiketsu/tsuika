import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useFolderName } from "@/hooks/use-folder";
import { cn } from "@/lib/utils";
import useLayoutStore, { cardLayout } from "@/stores/layout.store";
import { Slot } from "@radix-ui/react-slot";
import { useRouterState } from "@tanstack/react-router";
import { format } from "date-fns";
import { Folder, Inbox } from "lucide-react";
import { useMemo } from "react";
import { parse } from "tldts";

interface PropsType {
  url: string;
  createdAt: string | Date;
  folderId: string | null;
}

export default function BookmarkExtras(props: PropsType) {
  const layout = useLayoutStore((s) => s.layout);
  const domain = parse(props.url).domain;
  const isCompact = layout === cardLayout.COMPACT;
  const BadgeComp = isCompact ? Slot : Badge;

  const {
    location: { pathname },
  } = useRouterState();
  const { folderName } = useFolderName(props.folderId);

  const isAll = useMemo((): boolean => {
    const urlArr = decodeURIComponent(pathname).split("/");
    return ["bookmarks", "folder", "all"].every((i) => urlArr.includes(i));
  }, [pathname]);

  const responsiveSpan = cn(
    "max-w-20 truncate",
    "@lg/dash:max-w-58 @3xl/dash:max-w-28 @6xl/dash:max-w-24 @7xl/dash:max-w-48",
    { "@xl/dash:max-w-20 @7xl/dash:max-w-38": layout !== cardLayout.COMPACT }
  );

  return (
    <div
      className={cn(
        "text-foreground/60 inline-flex items-center space-x-2 font-medium"
      )}
    >
      {isAll ? (
        <Badge className="inline-flex items-center gap-1">
          {folderName ? <Folder size={14} /> : <Inbox size={14} />}
          <span className={responsiveSpan}>{folderName ?? "Unsorted"}</span>
        </Badge>
      ) : (
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: "info" }),
            "h-6 rounded-sm px-2 text-xs sm:h-6 sm:rounded-sm"
          )}
        >
          <span className={responsiveSpan}>{domain}</span>
        </a>
      )}
      {props.createdAt && (
        <BadgeComp variant="outline" className="text-muted-foreground text-xs">
          <span>{format(new Date(props.createdAt), "dd/MM/yyyy")}</span>
        </BadgeComp>
      )}
    </div>
  );
}
