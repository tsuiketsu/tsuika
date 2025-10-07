import { useCollaboratorForderStore } from "@/components/forms/folder/collaborate/store";
import Avatar from "@/components/ui/avatar";
import { useGetCollaboratorsQuery } from "@/queries/collab-folder.queries";
import clsx from "clsx";
import { useMemo } from "react";

const Skeletions = () => {
  return Array.from({ length: 5 }).map((_, idx) => (
    <div
      className="bg-card size-9 shrink-0 rounded-full border"
      key={`avatar-skeletion-${idx}`}
      style={{
        left: idx > 0 ? 24 * idx : 0,
        zIndex: idx,
        position: idx > 0 ? "absolute" : "static",
      }}
    />
  ));
};

export default function CollboratorAvatars({ folderId }: { folderId: string }) {
  const { data: users, isFetching } = useGetCollaboratorsQuery(folderId);

  const maxItems = 5;

  const slicedUsers = useMemo(() => {
    return users?.slice(0, maxItems);
  }, [users]);

  const remainingUsers = useMemo((): number => {
    return users?.slice(maxItems, users.length ?? 0).length ?? 0;
  }, [users]);

  if (!slicedUsers || slicedUsers?.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => useCollaboratorForderStore.getState().toggleOpen()}
      disabled={isFetching}
      className={clsx(
        "relative inline-flex rounded-md p-1 select-none",
        !isFetching && "hover:bg-secondary transition-color cursor-pointer"
      )}
      style={{
        width:
          24 * ((slicedUsers?.length || 0) + (remainingUsers ? 1 : 0)) + 16,
      }}
    >
      {isFetching ? (
        <Skeletions />
      ) : (
        slicedUsers?.map((user, idx) => (
          <Avatar
            key={`collborator-${idx}`}
            src={user.image || ""}
            fallback={user.username ?? user.name}
            className={clsx(
              "size-9 shadow-sm outline-none",
              idx > 0 && "absolute left-6"
            )}
            style={{ left: idx > 0 ? 24 * idx : 0 }}
            alt=""
          />
        ))
      )}
      {users && remainingUsers > 0 && (
        <span
          className="bg-card absolute flex size-9 items-center justify-center rounded-full border text-xs shadow-sm"
          style={{ left: 24 * maxItems, zIndex: 10 }}
        >
          +{remainingUsers}
        </span>
      )}
    </button>
  );
}
