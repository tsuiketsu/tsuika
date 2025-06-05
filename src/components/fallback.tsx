import type { LucideIconElement } from "@/types";

interface PropsType {
  title: string;
  description: string;
  icon: LucideIconElement;
}

export default function FallbackScreen(props: PropsType) {
  return (
    <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-2 text-sm">
      <props.icon size={60} />
      <div className="text-center">
        <span className="capitalize">{props.title}</span>
        <p>{props.description}</p>
      </div>
    </div>
  );
}
