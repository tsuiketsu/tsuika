import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronUp, LoaderCircle, User2 } from "lucide-react";

export default function UserProfile() {
  const { data: session, isPending } = useSession();

  const navigate = useNavigate();

  const logOut = async () => {
    await signOut().then(({ error }) => {
      if (!error) {
        navigate({ to: "/login" });
      }
    });
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            {isPending ? (
              <SidebarMenuButton>
                <LoaderCircle className="animate-spin" /> Username
              </SidebarMenuButton>
            ) : (
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {session?.user.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            )}
            <DropdownMenuContent side="top" className="w-60">
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logOut}>
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
