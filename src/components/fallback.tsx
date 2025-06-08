import type { LucideIconElement } from "@/types";

interface PropsType {
  title: string;
  description: string;
  icon: LucideIconElement;
  iconSize?: number;
}

export default function FallbackScreen(props: PropsType) {
  return (
    <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 rounded-md">
      <props.icon size={props.iconSize || 60} />
      <div className="text-center">
        <span className="text-xs font-medium capitalize">{props.title}</span>
        <p className="text-muted-foreground/60 text-xs">{props.description}</p>
      </div>
    </div>
  );
}
