import TagItems from "./tag-items";
import { useTagsData } from "@/hooks/use-tag";

export default function TagList() {
  const { ref: sneakyRef, tags, isFetching } = useTagsData();

  if (!isFetching && tags.length === 0) {
    return <div>No Tags</div>;
  }

  return <TagItems sneakyRef={sneakyRef} tags={tags} isFetching={isFetching} />;
}
