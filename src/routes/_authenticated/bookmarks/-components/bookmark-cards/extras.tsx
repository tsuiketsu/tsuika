import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useLayoutStore, { cardLayout } from "@/stores/layout.store";
import { Slot } from "@radix-ui/react-slot";
import dayjs from "dayjs";
import { parse } from "tldts";

export default function BookmarkExtras(props: {
  url: string;
  createdAt: string | Date;
}) {
  const layout = useLayoutStore((s) => s.layout);
  const domain = parse(props.url).domain;
  const isCompact = layout === cardLayout.COMPACT;
  const ButtonComp = isCompact ? Slot : Button;
  const BadgeComp = isCompact ? Slot : Badge;

  return (
    <div
      className={cn(
        "text-foreground/60 inline-flex items-center space-x-2 font-medium"
      )}
    >
      <ButtonComp
        variant="info"
        className={cn("h-6 px-2", { hidden: isCompact })}
        asChild
      >
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs"
        >
          {domain}
        </a>
      </ButtonComp>
      <BadgeComp variant="outline" className="text-muted-foreground text-xs">
        <span>{dayjs(props.createdAt).format("DD/MM/YYYY")}</span>
      </BadgeComp>
    </div>
  );
}
