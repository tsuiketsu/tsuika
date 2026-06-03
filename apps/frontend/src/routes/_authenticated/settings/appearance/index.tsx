import DashboardThumbnail from "./-fields/-dashboard-thumbnail";
import FontOptions from "./-font-options";
import { type Font } from "@/components/font/context/font-context";
import { useFont } from "@/components/font/context/use-font";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreferencesMutation } from "@/hooks/preferences.hook";
import { useUserProfileStore } from "@/stores/user-profile.store";
import { PreferencesFormSchema, type Preferences } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

export const Route = createFileRoute("/_authenticated/settings/appearance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setFont } = useFont();
  const pref = useUserProfileStore((s) => s.profile)?.preferencesJson;

  const mutation = usePreferencesMutation((preferences) => {
    if (preferences.font) {
      setFont(preferences.font as Font);
    }
  });

  const fontName = pref?.font ?? sessionStorage.getItem("vite-ui-font");

  const form = useForm<Preferences>({
    resolver: zodResolver(PreferencesFormSchema),
  });

  useEffect(() => {
    form.reset({
      font: pref?.font,
      dashboardThumbnail: pref?.dashboardThumbnail,
    });
  }, [form, pref]);

  const onSubmit: SubmitHandler<Preferences> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <DashboardThumbnail control={form.control} />
        <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-0.5">Font</FormLabel>
              <FormControl className="flex flex-col gap-2">
                <FontOptions
                  value={fontName as Font}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Select will be shown in most places, bookmarks, folders, tags..
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              isLoading={mutation.isPending}
              className="w-full @lg/dash:w-46"
            >
              Save preferences
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-48">
              Saving changes to the database may take a few seconds before
              they're applied.
            </p>
          </TooltipContent>
        </Tooltip>
      </form>
    </Form>
  );
}
