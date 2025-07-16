import { fetchAllTags } from "@/queries/tags.queries";
import { useQuery } from "@tanstack/react-query";

export const useTagsData = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchAllTags,
  });
};
