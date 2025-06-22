import TagOptions from "./tag-options";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Textarea } from "@/components/ui/textarea";
import { useSecuredFolders } from "@/hooks/secured-folder.hook";
import { cn } from "@/lib/utils";
import type { StringKeys } from "@/types";
import {
  type Bookmark,
  BookmarkFormSchema,
  type BookmarkFormSchemaType,
} from "@/types/bookmark";
import { getFavIcon } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { lazy, Suspense } from "react";
import { useForm, type Control } from "react-hook-form";

const FolderOptions = lazy(() => import("./folder-options.tsx"));

interface FieldProps {
  type?: "input" | "textarea";
  isHidden?: boolean;
  control: Control<BookmarkFormSchemaType>;
  placeholder: string;
  fieldName: StringKeys<BookmarkFormSchemaType>;
  className?: string;
}

const TextField = ({
  type = "input",
  fieldName,
  isHidden = false,
  control,
  placeholder,
  className,
}: FieldProps) => {
  const Comp = type === "input" ? Input : Textarea;

  if (isHidden) {
    return null;
  }

  return (
    <FormField
      control={control}
      name={fieldName as keyof BookmarkFormSchemaType}
      render={({ field: { value, ...field } }) => (
        <FormItem>
          <FormLabel className="capitalize">{fieldName}</FormLabel>
          <FormControl>
            <Comp
              value={value?.toString()}
              placeholder={placeholder}
              className={cn(className, { "min-h-28": type !== "input" })}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface PropsType {
  data?: Bookmark;
  onSubmit: (payload: BookmarkFormSchemaType) => void;
}

export default function BookmarkForm({ data, onSubmit }: PropsType) {
  const form = useForm<BookmarkFormSchemaType>({
    resolver: zodResolver(BookmarkFormSchema),
    defaultValues: data
      ? Object.fromEntries(
          Object.entries({ ...data }).filter(([_, value]) => value != null)
        )
      : {},
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
        <TextField
          type="textarea"
          isHidden={!isSecured && isFieldHidden("description")}
          control={form.control}
          placeholder="Keep track of your progress on-the-go with one of many AniList apps across iOS, Android, macOS, and Windows"
          fieldName="description"
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
