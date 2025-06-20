import { useFoldersData } from "./use-folder";
import { useSecureFolderStore } from "@/stores/secure-folder.store";
import type { Folder } from "@/types/folder";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export const useSecuredFolders = (slug: string) => {
  const [folder, setFolder] = useState<Folder | undefined>(undefined);
  const [isSecured, setIsSecured] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  const folderId = slug.split("/").slice(-1)[0];

  const { folders: sessionFolders } = useSecureFolderStore();

  useEffect(() => {
    if (sessionFolders.some((f) => f.folderId === folderId)) {
      setIsLocked(false);
    }
  }, [folderId, sessionFolders]);

  const queryClient = useQueryClient();

  const { folders, isFetching } = useFoldersData();

  useEffect(() => {
    if (!isFetching) {
      const current = folders.find((f) => f.id === folderId);
      if (current?.keyDerivation) {
        if (!useSecureFolderStore.getState().getKey(folderId)) {
          setIsLocked(true);
          setFolder(current);
        } else {
          setIsLocked(false);
        }
      } else {
        setIsSecured(false);
      }
    }
  }, [folderId, folders, isFetching, queryClient]);

  return { isSecured, isLocked, folder, isFetching };
};
