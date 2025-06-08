import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { LucideIconElement } from "@/types";
import { Link, type LinkProps } from "@tanstack/react-router";

interface PropsType {
  label: string;
  navigate: LinkProps;
  icon: LucideIconElement;
}

export default function SidebarLink(props: PropsType) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link {...props.navigate}>
          <props.icon />
          {props.label}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
