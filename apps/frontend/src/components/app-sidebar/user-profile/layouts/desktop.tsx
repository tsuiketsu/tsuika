import ProfileInfo from "../profile-info";
import type { User } from "../types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

interface PropsType {
  user: User | undefined;
  isFetching: boolean;
  onLogOut: () => void;
}

const ProfileDesktopLayout = ({ user, isFetching, onLogOut }: PropsType) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <ProfileInfo user={user} isFetching={isFetching} />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-60">
        <DropdownMenuItem asChild>
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogOut}>
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDesktopLayout;
