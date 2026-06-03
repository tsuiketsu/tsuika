import UserCard from "./user-card";
import useUserProfile from "@/hooks/user-profile.hook";
import { userRoles, type Collaborator } from "@/types/folder";
import { objectPick } from "@/utils";
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

  const _users = useMemo(() => {
    return users.length === 0
      ? [
          profile.data && {
            ...objectPick(profile.data, ["name", "image", "username"]),
            permissionLevel: "owner",
          },
        ]
      : users;
  }, [profile.data, users]);

  return (
    <div className="bg-card space-y-1.5 rounded-md p-2 select-none">
      {_users.map((user, idx) => {
        if (!user) return null;

        return (
          <React.Fragment key={`user-${user.username}`}>
            <UserCard
              image={user.image ?? ""}
              name={user.name ?? ""}
              username={user.username ?? ""}
              role={user.permissionLevel}
              folderId={folderId}
              isUserAuthorized={
                user.username !== profile.data?.username
                  ? isUserAuthorized
                  : false
              }
            />
            {users.length > 1 && users.length - 1 !== idx && <hr />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
