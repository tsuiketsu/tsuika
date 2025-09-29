import { useFoldersData } from "./use-folder";
import { DEFAULT_FOLDER_NAMES } from "@/constants";
import { useSecureFolderStore } from "@/stores/secure-folder.store";
import type { Folder } from "@/types/folder";
import { useQueryClient } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";

interface ReturnType {
  folderId: string;
  isSecured: boolean;
  isLocked: boolean;
  folder: Folder | undefined;
  isFetching: boolean;
}

export const useSecuredFolders = (): ReturnType => {
  const {
    location: { pathname },
  } = useRouterState();

  const [folder, setFolder] = useState<Folder | undefined>(undefined);
  const [isSecured, setIsSecured] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  const folderId = decodeURIComponent(pathname).split("/").slice(-1)[0];
  const sessionFolders = useSecureFolderStore((s) => s.folders);
  const queryClient = useQueryClient();

  const { folders, isFetching } = useFoldersData();

  useEffect(() => {
    if (!isSecured || sessionFolders.some((f) => f.folderId === folderId)) {
      setIsLocked(false);
    }
  }, [folderId, isSecured, sessionFolders]);

  useEffect(() => {
    if (!isFetching && folders.length > 0) {
      const current = folders.find((f) => f.id === folderId);
      if (current?.settings?.keyDerivation) {
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

    return () => {
      setIsLocked(!DEFAULT_FOLDER_NAMES.includes(folderId));
      setIsSecured(folders.length !== 0);
    };
  }, [
    folderId,
    folders,
    isFetching,
    queryClient,

    // To sync with useSecureFolderStore to reflect immediate changes
    sessionFolders.length,
  ]);

  return { folderId, isSecured, isLocked, folder, isFetching };
};
