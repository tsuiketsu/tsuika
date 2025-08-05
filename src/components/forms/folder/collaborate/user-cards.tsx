import UserCard from "./user-card";
import useUserProfile from "@/hooks/user-profile.hook";
import { userRoles, type Collaborator } from "@/types/folder";
import React, { useMemo } from "react";

interface PropsType {
  users: Collaborator[];
  folderId: string;
}

export default function UserCards({ users, folderId }: PropsType) {
  const profile = useUserProfile();

  const isUserAuthorized = useMemo((): boolean => {
    const selectedUser = users?.find(
      ({ username }) => username === profile.data?.username
    );

    return [userRoles.OWNER, userRoles.ADMIN].includes(
      selectedUser?.permissionLevel ?? ""
    );
  }, [profile.data?.username, users]);

  return (
    <div className="bg-card space-y-1.5 rounded-md p-2 select-none">
      {users.map((user, idx) => (
        <React.Fragment key={`user-${user.username}`}>
          <UserCard
            image={user.image ?? ""}
            name={user.name}
            username={user.username ?? ""}
            role={user.permissionLevel}
            folderId={folderId}
            isUserAuthorized={
              user.username !== profile.data?.username
                ? isUserAuthorized
                : false
            }
          />
          {users.length - 1 !== idx && <hr />}
        </React.Fragment>
      ))}
    </div>
  );
}
