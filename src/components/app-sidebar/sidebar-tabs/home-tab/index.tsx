import BookmarkFolders from "./bookmark-folders";
import DefaultFolders from "./default-folders";

export default function HomeTab() {
  return (
    <div>
      <DefaultFolders />
      <BookmarkFolders />
    </div>
  );
}
