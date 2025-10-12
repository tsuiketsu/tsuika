import GenaiFolderInfoSkeletion from "./skeletion";
import AITextWritter from "@/features/genai/components/text";
import { fetchBookmarkUrls } from "@/queries/bookmark.queries";
import { useQuery } from "@tanstack/react-query";

interface PropsType {
  folderId: string;
  onValueChange: (value: { name: string; desc: string }) => void;
}

export default function GenaiFolderInfo({
  folderId,
  onValueChange,
}: PropsType) {
  const {
    data: bookmarkUrls,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ["bookmark-urls", folderId],
    queryFn: async () => folderId && (await fetchBookmarkUrls(folderId)),
    enabled: Boolean(folderId),
    retry: 0,
  });

  const onGenerate = (value: string) => {
    const splits = value.split("|");
    onValueChange({
      name: splits[0]?.trim() ?? "",
      desc: splits[1]?.trim() ?? "",
    });
  };

  if (isLoading) {
    return <GenaiFolderInfoSkeletion />;
  }

  if (isFetched && !bookmarkUrls) return null;

  return (
    <div className="inline-flex w-full items-center justify-between border-y py-4">
      <div className="flex flex-col">
        <span className="text-sm">Generate</span>
        <span className="text-muted-foreground text-xs">
          Generate title and description with AI
        </span>
      </div>
      <AITextWritter
        variant="secondary"
        systemInstruction="content_descriptor"
        onValueChange={onGenerate}
        prompt={[...(bookmarkUrls ?? [])]?.join(",")}
      />
    </div>
  );
}
