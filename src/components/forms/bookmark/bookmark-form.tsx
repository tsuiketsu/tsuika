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
import type { SuccessResponse } from "@/types";
import { type Bookmark, BookmarkInsertSchema } from "@/types/bookmark";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import type { UseMutationResult } from "@tanstack/react-query";
import type { type } from "arktype";
import type { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";

interface PropsType {
  data?: Bookmark;
  mutation: UseMutationResult<
    AxiosResponse<SuccessResponse<Bookmark>>,
    unknown,
    type.infer<typeof BookmarkInsertSchema>
  >;
}

export default function BookmarkForm({ data, mutation }: PropsType) {
  const form = useForm<type.infer<typeof BookmarkInsertSchema>>({
    resolver: arktypeResolver(BookmarkInsertSchema),
    defaultValues: data,
  });

  async function onSubmit(values: type.infer<typeof BookmarkInsertSchema>) {
    mutation.mutate(values);
  }

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
      </form>
    </Form>
  );
}
