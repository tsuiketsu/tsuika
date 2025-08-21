import Content from "./-components/content";
import Loading from "./-components/loading";
import { fetchBookamrk } from "@/queries/bookmark.queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/bookmarks/_bookmark/b/$id"
)({
  component: Main,
});

function Main() {
  const { id } = Route.useParams();

  const {
    data: bookmark,
    isFetching,
    isFetched,
    error,
  } = useQuery({
    queryKey: ["bookmark", id],
    queryFn: async () => await fetchBookamrk(id),
  });

  if (isFetching) return <Loading />;

  if ((isFetched && !bookmark) || error) return "Data not found!";

  return bookmark ? <Content bookmark={bookmark} /> : "Date not found";
}
