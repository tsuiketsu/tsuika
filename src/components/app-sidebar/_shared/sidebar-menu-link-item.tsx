import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, type LinkComponentProps } from "@tanstack/react-router";

interface PropsType extends LinkComponentProps {
  children: React.ReactNode;
}

const SidebarMenuLinkItem = ({ children, ...props }: PropsType) => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link {...props} className="[&.active]:bg-secondary">
          {children}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

export default SidebarMenuLinkItem;
