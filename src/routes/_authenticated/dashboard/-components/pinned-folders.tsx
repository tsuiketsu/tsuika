import IconCard from "./_shared/icon-card";
import { FolderIcon } from "lucide-react";

export default function PinnedFolders() {
  return (
    <div className="grid grid-cols-3 gap-2 overflow-hidden @2xl:grid-cols-6 @6xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <IconCard
          key={`collection-${idx}`}
          count={idx}
          label="Folder"
          icon={FolderIcon}
        />
      ))}
    </div>
  );
}
