import FolderOptions from "./folder-options";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { StringKeys } from "@/types";
import {
  type Bookmark,
  BookmarkFormSchema,
  type BookmarkFormSchemaType,
} from "@/types/bookmark";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense } from "react";
import { useForm, type Control } from "react-hook-form";

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
              className={cn(className)}
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
          Object.entries(data).filter(([_, value]) => value != null)
        )
      : {},
  });

  const isFieldHidden = (field: keyof BookmarkFormSchemaType): boolean => {
    return !data && BookmarkFormSchema.shape[field].isOptional();
  };

  return (
    <Form {...form}>
      <form
        id="bookmark-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Suspense>
          <FolderOptions control={form.control} />
        </Suspense>
        <TextField
          control={form.control}
          placeholder="e.g., https://anilist.co"
          fieldName="url"
        />

        <TextField
          isHidden={isFieldHidden("title")}
          control={form.control}
          placeholder="e.g., The next generation anime platform"
          fieldName="title"
        />

        <TextField
          type="textarea"
          isHidden={isFieldHidden("description")}
          control={form.control}
          placeholder="Keep track of your progress on-the-go with one of many AniList apps across iOS, Android, macOS, and Windows"
          fieldName="description"
        />
      </form>
      <TagOptions control={form.control} />
    </Form>
  );
}
