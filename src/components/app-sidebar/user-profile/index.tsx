import ProfileDesktopLayout from "./layouts/desktop";
import ProfileMobileLayout from "./layouts/mobile";
import { useIsMobile } from "@/hooks/use-mobile";
import useUserProfile from "@/hooks/user-profile.hook";
import { signOut } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";

export default function UserProfile() {
  const { data: user, isFetching } = useUserProfile();

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const logOut = async () => {
    await signOut().then(({ error }) => {
      if (!error) {
        navigate({ to: "/login" });
      }
    });
  };

  if (isMobile)
    return (
      <ProfileMobileLayout
        user={user}
        isFetching={isFetching}
        onLogOut={logOut}
      />
    );

  return (
    <ProfileDesktopLayout
      user={user}
      isFetching={isFetching}
      onLogOut={logOut}
    />
  );
}
