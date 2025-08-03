import UserCard from "./user-card";
import useUserProfile from "@/hooks/user-profile.hook";
import { userRoles, type Collaborator } from "@/types/folder";
import React from "react";

interface PropsType {
  users: Collaborator[];
}

export default function UserCards({ users }: PropsType) {
  const { data: owner } = useUserProfile();

  return (
    <div className="bg-card space-y-1.5 rounded-md p-2 select-none">
      {owner && (
        <UserCard
          name={owner.name ?? ""}
          username={owner.username ?? ""}
          image={owner.image ?? ""}
          role={userRoles.OWNER}
        />
      )}
      <hr />
      {users.map((user, idx) => (
        <React.Fragment key={`user-${user.username}`}>
          <UserCard
            image={user.image ?? ""}
            name={user.name}
            username={user.username ?? ""}
            role={user.permissionLevel}
          />
          {users.length - 1 !== idx && <hr />}
        </React.Fragment>
      ))}
    </div>
  );
}
