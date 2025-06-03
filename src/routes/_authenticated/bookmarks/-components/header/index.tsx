import TagIcon from "./tag-icon";
import { defaultFolders } from "@/components/app-sidebar/sections/general/bookmark-options/constants";
import FolderMenu from "@/components/dropdowns/folder-menu";
import TagMenu from "@/components/dropdowns/tag-menu";
import Show from "@/components/show";
import { Skeleton } from "@/components/ui/skeleton";
import { useFoldersData } from "@/hooks/use-folder";
import { useTagsData } from "@/hooks/use-tag";

interface PropsType {
  slug: string;
}

const getDefaultFolder = (url: string) => {
  return defaultFolders.find((folder) => {
    const { slug } = folder.link.params as { slug: string };
    if (!slug) return false;
    return slug.split("/").slice(-1).join("") === url;
  });
};

const Title = ({ title, isLoading }: { title: string; isLoading: boolean }) => {
  if (isLoading && !getDefaultFolder(title)) {
    return <Skeleton className="h-7 w-3/6 @3xl:w-2/6 @4xl:w-1/3 @5xl:w-1/6" />;
  }

  const Icon = getDefaultFolder(title)?.icon;

  return (
    <h2 className="inline-flex items-center gap-2 text-2xl font-bold capitalize">
      {Icon && <Icon />}
      {title}
    </h2>
  );
};

export default function BookmarksPageHeader({ slug }: PropsType) {
  const splits = slug.split("/");

  const pageType = splits[0];
  const query = splits[splits.length - 1];

  const { folders, isFetching: isFoldersFetching } = useFoldersData();
  const { tags, isFetching: isTagsFetching } = useTagsData();

  const selectedTag = tags.find(({ id }) => id === query);
  const selectedFolder = folders.find(({ id }) => id === query);
  const defaultFolder = getDefaultFolder(splits[1]);

  const description =
    isFoldersFetching && !defaultFolder?.description ? (
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-4/5 @3xl:w-2/4 @4xl:w-1/2 @5xl:w-2/5" />
        <Skeleton className="h-4 w-2/3 @3xl:w-2/6 @4xl:w-1/5 @5xl:w-2/6" />
      </div>
    ) : (
      <p>{selectedFolder?.description || defaultFolder?.description}</p>
    );

  const Actions =
    pageType === "folder" && selectedFolder ? (
      <FolderMenu folder={selectedFolder} />
    ) : (
      selectedTag && <TagMenu tag={selectedTag} />
    );

  const isLoading = pageType === "tag" ? isTagsFetching : isFoldersFetching;
  const title = (() => {
    if (getDefaultFolder(splits[1])) {
      return splits[1];
    }

    if (pageType === "folder") return selectedFolder?.name ?? "";
    return selectedTag?.name ?? "";
  })();

  return (
    <div className="inline-flex w-full items-start justify-between">
      <div className="w-full">
        <div className="inline-flex w-full items-center gap-2">
          <Show when={pageType === "tag"}>
            <TagIcon isLoading={isTagsFetching} color={selectedTag?.color} />
          </Show>
          <Title title={title} isLoading={isLoading} />
        </div>
        {pageType !== "tag" && description}
      </div>
      {Actions}
    </div>
  );
}
