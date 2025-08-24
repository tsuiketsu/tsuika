import ContentField from "./content-field.tsx";
import TagOptions from "./tag-options";
import TextField from "@/components/primitives/form/text-field.tsx";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import {
  type Bookmark,
  BookmarkFormSchema,
  type BookmarkFormSchemaType,
} from "@/types/bookmark";
import { getFavIcon, objectPick } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouterState } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useForm } from "react-hook-form";

const FolderOptions = lazy(() => import("./folder-options.tsx"));

interface PropsType {
  data?: Bookmark;
  onSubmit: (payload: BookmarkFormSchemaType) => void;
  isPending?: boolean;
}

export default function BookmarkForm({ data, onSubmit, isPending }: PropsType) {
  const {
    location: { pathname },
  } = useRouterState();

  const form = useForm<BookmarkFormSchemaType>({
    resolver: zodResolver(BookmarkFormSchema),
    defaultValues: {
      url: data?.url ?? "",
      title: data?.title ?? "",
      description: data?.description ?? "",
      thumbnail: data?.thumbnail,
      folderId:
        data?.folderId ?? decodeURIComponent(pathname).split("/").slice(-1)[0],
      tags:
        data?.tags?.map((tag) => objectPick(tag, ["id", "name", "color"])) ??
        [],
    },
  });

  const { folderId: securedFolderId, isSecured } = useSecuredFolders();

  const isFieldHidden = (field: keyof BookmarkFormSchemaType): boolean => {
    return !data && BookmarkFormSchema.shape[field].isOptional();
  };

  return (
    <Form {...form}>
      <form
        id="bookmark-form"
        onSubmit={form.handleSubmit((v) =>
          onSubmit({
            ...v,
            isEncrypted: isSecured,
            folderId: isSecured ? securedFolderId : v.folderId,
            faviconUrl: getFavIcon(v.url),
          })
        )}
        className="space-y-4"
      >
        {!isSecured && (
          <Suspense
            fallback={
              <div className="w-full space-y-2.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 border" />
              </div>
            }
          >
            <FolderOptions control={form.control} />
          </Suspense>
        )}
        <TextField
          control={form.control}
          placeholder="e.g., https://anilist.co"
          fieldName="url"
        />
        <TextField
          isHidden={!isSecured && isFieldHidden("title")}
          control={form.control}
          placeholder="e.g., The next generation anime platform"
          fieldName="title"
        />
        <ContentField
          control={form.control}
          description={data?.description}
          isLoading={isPending ?? false}
        />
        {isSecured && (
          <TextField
            control={form.control}
            placeholder="e.g., https://placehold.co/600x400"
            fieldName="thumbnail"
          />
        )}
      </form>
      <TagOptions control={form.control} />
    </Form>
  );
}
