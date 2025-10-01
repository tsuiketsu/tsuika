import { Skeleton } from "@/components/ui/skeleton";
import { Link, type LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface PropsType {
  count: string | number;
  label: string;
  icon: LucideIcon;
  isFetching?: boolean;
  navigate?: LinkProps;
}

export default function IconCard(props: PropsType) {
  const Comp = props.navigate ? Link : "div";

  return (
    <Comp
      {...props.navigate}
      className="bg-card relative flex min-h-24 flex-col justify-between gap-3 rounded-md p-3 shadow-xs"
    >
      <span className="font-cal-sans text-xl font-medium">
        {props.isFetching ? <Skeleton className="size-8" /> : props.count}
      </span>
      <span className="text-muted-foreground text-sm capitalize">
        {props.label}
      </span>
      <span className="absolute top-2 right-2 rounded-sm border p-1.5">
        <props.icon size={20} />
      </span>
    </Comp>
  );
}
