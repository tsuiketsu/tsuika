import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { LucideIconElement } from "@/types";
import { Link, type LinkProps } from "@tanstack/react-router";

interface PropsType {
  label: string;
  navigate: LinkProps;
  icon: LucideIconElement;
  tooltip?: string;
}

export default function SidebarLink(props: PropsType) {
  return (
    <SidebarMenuButton tooltip={props.tooltip} asChild>
      <Link {...props.navigate}>
        <props.icon />
        {props.label}
      </Link>
    </SidebarMenuButton>
  );
}
