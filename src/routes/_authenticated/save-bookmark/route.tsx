import BookmarkForm from "@/components/forms/bookmark/form";
import { Button } from "@/components/ui/button";
import { insertInfQueryData } from "@/lib/query.utils";
import { addBookmark } from "@/queries/bookmark.queries";
import type { Bookmark, BookmarkFormSchemaType } from "@/types/bookmark";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import type { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/save-bookmark")({
  component: RouteComponent,
  validateSearch: (search) => schema.optional().parse(search),
});

function RouteComponent() {
  const shared = Route.useSearch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    location: { pathname },
  } = useRouterState();

  const mutation = useMutation({
    mutationKey: ["save-bookmark"],
    mutationFn: addBookmark,
    onSuccess: ({ data: { data } }, bookmark) => {
      const bookmarkFolder = bookmark.folderId
        ? `folder/${bookmark.folderId}`
        : "folder/unsorted";

      const queryKey: unknown[] = ["bookmarks", bookmarkFolder, ""];

      queryClient.setQueryData<{ pages: { data: Bookmark[] }[] }>(
        queryKey,
        (old) => insertInfQueryData(old, data)
      );

      navigate({
        to: "/bookmarks/$slug",
        params: { slug: bookmarkFolder },
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (payload: BookmarkFormSchemaType) => {
    mutation.mutate({
      ...payload,
      folderId:
        payload.folderId === pathname.replace("/", "")
          ? undefined
          : payload.folderId,
    });
  };

  if (!shared?.text) {
    return <div>Invalid URL</div>;
  }

  return (
    <div className="mx-auto w-full space-y-4 @lg/dash:max-w-sm">
      <h3 className="border-b pb-3 text-lg font-medium">Save Bookmark</h3>
      <BookmarkForm
        data={{ url: shared.text, title: shared.title }}
        onSubmit={onSubmit}
      />
      <Button
        type="submit"
        form="bookmark-form"
        className="w-full"
        isLoading={mutation.isPending}
      >
        Save
      </Button>
    </div>
  );
}
