import Avatar from "@/components/ui/avatar";
import { useGetCollaboratorsQuery } from "@/queries/collab-folder.queries";
import clsx from "clsx";
import { useMemo } from "react";

export default function CollboratorAvatars({ folderId }: { folderId: string }) {
  const { data: users } = useGetCollaboratorsQuery(folderId);

  const maxItems = 5;

  const slicedUsers = useMemo(() => {
    return users?.slice(0, maxItems);
  }, [users]);

  const remainingUsers = useMemo((): number => {
    return users?.slice(maxItems, users.length ?? 0).length ?? 0;
  }, [users]);

  return (
    <div className="relative inline-flex">
      {slicedUsers?.map((user, idx) => (
        <Avatar
          key={`collborator-${idx}`}
          src={user.image || ""}
          fallback={user.name}
          className={clsx(
            "size-9 shadow-sm outline-none",
            idx > 0 && "absolute left-6"
          )}
          style={{ left: idx > 0 ? 24 * idx : 0 }}
          alt=""
        />
      ))}
      {users && remainingUsers > 0 && (
        <span
          className="bg-card absolute flex size-9 items-center justify-center rounded-full border text-xs shadow-sm"
          style={{ left: 24 * maxItems }}
        >
          +{remainingUsers}
        </span>
      )}
    </div>
  );
}
