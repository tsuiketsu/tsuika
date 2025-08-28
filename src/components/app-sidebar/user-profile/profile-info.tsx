import type { ProfileFormSchema } from "@/routes/_authenticated/settings/profile";
import { ChevronUp, LoaderCircle, User2 } from "lucide-react";

interface PropsType {
  user: (ProfileFormSchema & { image: string }) | undefined;
  isFetching: boolean;
  showArrow?: boolean;
}

export default function ProfileInfo({
  user,
  isFetching,
  showArrow = true,
}: PropsType) {
  if (isFetching) {
    return (
      <>
        <LoaderCircle className="animate-spin" /> Loading...
      </>
    );
  }

  return (
    <>
      <User2 /> {user?.name}
      {showArrow && <ChevronUp className="ml-auto" />}
    </>
  );
}
