import CollboratorAvatarsSkeletions from "./collborator-avatars/skeletions";
import { defaultFolders } from "@/components/app-sidebar/sections/general/bookmark-options/constants";
import FolderMenu from "@/components/dropdowns/folder-menu";
import TagMenu from "@/components/dropdowns/tag-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { useFoldersData } from "@/hooks/use-folder";
import { useTagsData } from "@/hooks/use-tag";
import { lazy, Suspense } from "react";

const CollboratorAvatars = lazy(() => import("./collborator-avatars"));

interface TitleProps {
  title: string;
  isLoading: boolean;
  pageType: string;
}

interface DescriptionProps {
  slug: string;
  description: string;
  isLoading: boolean;
}

const Title = ({ title, isLoading }: TitleProps) => {
  if (isLoading && !getDefaultFolder(title)) {
    return <Skeleton className="h-7 w-3/6 @3xl:w-2/6 @4xl:w-1/3 @5xl:w-1/6" />;
  }

  return (
    <h2 className="inline-flex items-center gap-2 text-2xl font-bold capitalize">
      {title}
    </h2>
  );
};

const Description = ({ slug, description, isLoading }: DescriptionProps) => {
  const defaultFolder = getDefaultFolder(slug.split("/")[1]);

  if (isLoading) {
    <div className="space-y-2 pt-2">
      <Skeleton className="h-4 w-4/5 @3xl:w-2/4 @4xl:w-1/2 @5xl:w-2/5" />
      <Skeleton className="h-4 w-2/3 @3xl:w-2/6 @4xl:w-1/5 @5xl:w-2/6" />
    </div>;
  }

  return (
    <p className="text-muted-foreground">
      {description || defaultFolder?.description}
    </p>
  );
};

export default function BookmarksPageHeader({ slug }: { slug: string }) {
  const splits = slug.split("/");

  const pageType = splits[0];
  const query = splits[splits.length - 1];

  const { folders, isFetching: isFoldersFetching } = useFoldersData();
  const { data: tags, isFetching: isTagsFetching } = useTagsData();
  const { isSecured } = useSecuredFolders();

  // Tag and Folder based on slug
  const selectedTag = tags?.find(({ id }) => id === query);
  const selectedFolder = folders.find(({ id }) => id === query);

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
        <div className="flex w-full flex-col justify-center gap-2">
          <Title title={title} isLoading={isLoading} pageType={pageType} />
          {!isSecured && selectedFolder?.id && (
            <Suspense
              fallback={
                <div className="relative inline-flex rounded-md p-1 select-none">
                  <CollboratorAvatarsSkeletions />
                </div>
              }
            >
              <CollboratorAvatars folderId={selectedFolder?.id} />
            </Suspense>
          )}
          {pageType !== "tag" && selectedFolder?.description && (
            <Description
              slug={slug}
              description={selectedFolder?.description}
              isLoading={isFoldersFetching}
            />
          )}
        </div>
      </div>
      {pageType === "folder" && selectedFolder ? (
        <FolderMenu folder={selectedFolder} />
      ) : (
        selectedTag && <TagMenu tag={selectedTag} />
      )}
    </div>
  );
}

function getDefaultFolder(url: string) {
  const folder = defaultFolders.find((folder) => {
    const { slug } = folder.link.params as { slug: string };
    if (!slug) return false;
    return slug.split("/").slice(-1).join("") === url;
  });

  return folder;
}
