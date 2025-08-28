import ProfileInfo from "../profile-info";
import type { User } from "../types";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerFooter,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { LogOutIcon, SettingsIcon } from "lucide-react";

interface PropsType {
  user: User | undefined;
  isFetching: boolean;
  onLogOut: () => void;
}

const ProfileMobileLayout = ({ user, isFetching, onLogOut }: PropsType) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <SidebarMenuButton className="cursor-pointer border">
          <ProfileInfo user={user} isFetching={isFetching} showArrow={false} />
        </SidebarMenuButton>
      </DrawerTrigger>
      <DrawerContent className="space-y-2">
        <div className="inline-flex items-center gap-4 border-b px-4 pb-4">
          <Avatar
            src={user?.image ?? ""}
            alt={user?.username ?? ""}
            fallback={user?.name}
          />
          <div className="flex flex-col">
            <span className="text-sm">{user?.name}</span>
            <span className="text-muted-foreground text-xs">
              @{user?.username}
            </span>
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start px-0"
              asChild
            >
              <Link to="/settings" className="text-start">
                <SettingsIcon />
                Settings
              </Link>
            </Button>
          </DrawerClose>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start px-0"
            onClick={onLogOut}
          >
            <LogOutIcon />
            <span>Sign Out</span>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProfileMobileLayout;
