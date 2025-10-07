import Avatar from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useUserProfile from "@/hooks/user-profile.hook";

export default function Banner() {
  const { data: user, isFetching } = useUserProfile();

  if (isFetching) {
    return (
      <Skeleton className="aspect-11/8 rounded-xl @3xl/dash:aspect-11/5" />
    );
  }

  return (
    <div className="relative aspect-11/8 overflow-hidden rounded-md @3xl/dash:aspect-11/5 @7xl/dash:col-span-2">
      <img
        src="https://ik.imagekit.io/s2uoi7msg/tsuika/dashboard-background.jpg?updatedAt=1758523741017"
        alt="dashboard banner"
        className="size-full object-cover"
      />
      {user && (
        <div className="bg-background/60 absolute bottom-4 left-4 inline-flex items-center gap-3 rounded-full p-1 pr-8 font-sans backdrop-blur-sm">
          <Avatar
            src={user?.image}
            fallback={user.username ?? user.name ?? ""}
            alt="dashboard avatar"
            className="size-12 capitalize outline-none"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold">Welcome back!</span>
            <span className="text-xs">{user?.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
