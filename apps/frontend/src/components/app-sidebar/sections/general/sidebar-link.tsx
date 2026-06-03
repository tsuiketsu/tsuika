import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { LucideIconElement } from "@/types";
import { useNavigate, type LinkProps } from "@tanstack/react-router";

interface PropsType {
  label: string;
  navigate: LinkProps;
  icon: LucideIconElement;
  tooltip?: string;
}

export default function SidebarLink(props: PropsType) {
  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => navigate(props.navigate)}>
          <props.icon />
          {props.label}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
