import { useQuery } from "@tanstack/react-query";
import { fetchAllTags } from "@/queries/tags.queries";

export const useTagsData = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchAllTags,
  });
};
