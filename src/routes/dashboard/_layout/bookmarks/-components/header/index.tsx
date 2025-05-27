import TagIcon from "./tag-icon";
import FolderMenu from "@/components/dropdowns/folder-menu";
import TagMenu from "@/components/dropdowns/tag-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useFoldersData } from "@/hooks/use-folder";
import { useTagsData } from "@/hooks/use-tag";

interface PropsType {
  slug: string;
}

export default function BookmarksPageHeader({ slug }: PropsType) {
  const splits = slug.split("/");

  const title = splits[splits.length - 1];
  const pageType = splits[0];
  const query = splits[splits.length - 1];

  const { folders, isFetching: isFoldersFetching } = useFoldersData();
  const { tags, isFetching: isTagsFetching } = useTagsData();

  const selectedTag = tags.find(({ name }) => name === query);
  const selectedFolder = folders.find(({ slug }) => slug === query);

  const description = isFoldersFetching ? (
    <div className="space-y-2 pt-2">
      <Skeleton className="h-4 w-4/5 @3xl:w-2/4 @4xl:w-1/2 @5xl:w-2/5" />
      <Skeleton className="h-4 w-2/3 @3xl:w-2/6 @4xl:w-1/5 @5xl:w-2/6" />
    </div>
  ) : (
    <p>{folders.find(({ slug }) => slug === query)?.description ?? ""}</p>
  );

  const Actions =
    pageType === "folder" && selectedFolder ? (
      <FolderMenu folder={selectedFolder} />
    ) : (
      selectedTag && <TagMenu tag={selectedTag} />
    );

  return (
    <div className="inline-flex w-full items-start justify-between">
      <div className="w-full">
        <div className="inline-flex items-center gap-2">
          {pageType === "tag" && (
            <TagIcon isLoading={isTagsFetching} color={selectedTag?.color} />
          )}
          <h2 className="text-2xl font-bold capitalize">{`${title}`}</h2>
        </div>
        {pageType !== "tag" && description}
      </div>

      {Actions}
    </div>
  );
}
