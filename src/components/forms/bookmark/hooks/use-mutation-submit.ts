import { useFoldersData } from "@/hooks/use-folder";
import type { BookmarkFormSchemaType } from "@/types/bookmark";
import { useCallback } from "react";

export default function useMutationSubmit(
  mutate: (payload: BookmarkFormSchemaType) => void
) {
  const { folders } = useFoldersData();

  return useCallback(
    (payload: BookmarkFormSchemaType) => {
      const folder = folders.find((f) => f.id === payload.folderId);
      const isSecuredFolder = Boolean(folder?.settings?.keyDerivation);

      mutate({
        ...payload,
        isLinkPreview: isSecuredFolder
          ? Boolean(folder?.settings?.isLinkPreview)
          : true,
      });
    },
    [folders, mutate]
  );
}
