import Avatar from "@/components/ui/avatar";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { type UserRole, userRoles } from "@/types/folder";
import { username } from "better-auth/plugins/username";

interface PropsType {
  image: string;
  name: string;
  username: string;
  role: UserRole;
}

const roles = Object.values(userRoles).filter(
  (role) => role !== userRoles.OWNER
);

const UserRoles = ({ role }: { role: UserRole }) => {
  if (role === userRoles.OWNER) {
    return <span className="ml-auto pr-3 text-sm font-medium">{role}</span>;
  }

  return (
    <Select value={role}>
      <SelectTrigger size="sm" className="ml-auto w-28 cursor-pointer">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem value={role}>{role}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default function UserCard(props: PropsType) {
  return (
    <div className="inline-flex w-full items-center gap-3 p-1">
      <Avatar
        src={props.image}
        fallback={props.name}
        alt={`${username}-avatar`}
        className="size-10"
      />
      <div className="flex flex-col gap-1 text-sm">
        <span>{props.name}</span>
        <span className="text-muted-foreground">@{props.username}</span>
      </div>
      <UserRoles role={props.role} />
    </div>
  );
}
