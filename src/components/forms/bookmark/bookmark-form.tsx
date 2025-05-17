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
import { type Bookmark, BookmarkFormSchema } from "@/types/bookmark";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import type { type } from "arktype";
import { useForm } from "react-hook-form";

interface PropsType {
  data?: Bookmark;
  onSubmit: (payload: type.infer<typeof BookmarkFormSchema>) => void;
}

export default function BookmarkForm({ data, onSubmit }: PropsType) {
  const form = useForm<type.infer<typeof BookmarkFormSchema>>({
    resolver: arktypeResolver(BookmarkFormSchema),
    defaultValues: data
      ? Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value != null)
        )
      : {},
  });

  return (
    <Form {...form}>
      <form
        id="bookmark-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="e.g., https://anilist.co"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="title"
                  placeholder="e.g., The next generation anime platform"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Keep track of your progress on-the-go with one of many AniList apps across iOS, Android, macOS, and Windows"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., https://placehold.co/800x480"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
