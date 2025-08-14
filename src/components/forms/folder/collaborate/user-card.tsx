import { SvgSpinners3DotsScale } from "@/components/icons/dots-loader";
import Avatar from "@/components/ui/avatar";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import useUserProfile from "@/hooks/user-profile.hook";
import {
  changeMemberRole,
  invalidateCollaboratorsData,
} from "@/queries/collab-folder.queries";
import { type UserRole, userRoles } from "@/types/folder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { username } from "better-auth/plugins/username";
import { useId } from "react";

interface UserCardProps {
  image: string;
  name: string;
  username: string;
  role: UserRole;
  folderId: string;
  isUserAuthorized: boolean;
}

type UserRolesProps = Pick<
  UserCardProps,
  "username" | "role" | "folderId" | "isUserAuthorized"
>;

const roles = Object.values(userRoles).filter(
  (role) => role !== userRoles.OWNER
);

const UserRoles = (props: UserRolesProps) => {
  const { username, role, folderId, isUserAuthorized } = props;

  const queryClient = useQueryClient();
  const uniqueId = useId();

  const mutation = useMutation({
    mutationKey: ["change-user-role", { folderId }],
    mutationFn: changeMemberRole,
    onSuccess: () => {
      invalidateCollaboratorsData(queryClient, folderId);
    },
  });

  const changeRoleHandler = (value: UserRole) =>
    mutation.mutate({
      folderId,
      identifier: username,
      role: value,
    });

  if (!isUserAuthorized || role === userRoles.OWNER) {
    return <span className="ml-auto pr-3 text-sm font-medium">{role}</span>;
  }

  return (
    <Select defaultValue={role} onValueChange={changeRoleHandler}>
      <SelectTrigger size="sm" className="ml-auto w-28 cursor-pointer">
        {mutation.isPending ? (
          <SvgSpinners3DotsScale />
        ) : (
          <SelectValue placeholder="Role" />
        )}
      </SelectTrigger>
      <SelectContent>
        {roles.map((role, idx) => (
          <SelectItem key={`${uniqueId}-${idx}`} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default function UserCard(props: UserCardProps) {
  const { data: user } = useUserProfile();

  return (
    <div className="inline-flex w-full items-center gap-3 p-1">
      <Avatar
        src={props.image}
        fallback={props.name}
        alt={`${username}-avatar`}
        className="size-10"
      />
      <div className="flex flex-col gap-1 text-sm">
        <span>{user?.username === props.username ? "You" : props.name}</span>
        <span className="text-muted-foreground">@{props.username}</span>
      </div>
      <UserRoles
        role={props.role}
        username={props.username}
        folderId={props.folderId}
        isUserAuthorized={props.isUserAuthorized}
      />
    </div>
  );
}
