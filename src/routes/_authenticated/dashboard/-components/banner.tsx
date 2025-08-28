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
        src="https://w.wallhaven.cc/full/47/wallhaven-47zo9v.jpg"
        alt="dashboard banner"
        className="size-full object-cover"
      />
      {user && (
        <div className="bg-background/60 absolute bottom-4 left-4 inline-flex h-14 items-center gap-3 rounded-full p-2 pr-8 font-sans backdrop-blur-sm">
          <Avatar
            src={user?.image}
            fallback={user?.username?.substring(0, 1)}
            alt="dashboard avatar"
            className="size-10 capitalize"
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
