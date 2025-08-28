import FontOptions from "./-font-options";
import { fonts, type Font } from "@/components/font/context/font-context";
import { useFont } from "@/components/font/context/use-font";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreferencesMutation } from "@/hooks/preferences.hook";
import { useUserProfileStore } from "@/stores/user-profile.store";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/_authenticated/settings/appearance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setFont } = useFont();
  const pref = useUserProfileStore((s) => s.profile)?.preferencesJson;
  const payloadFont = useRef<Font>(fonts.default);

  const mutation = usePreferencesMutation((preferences) => {
    if (preferences.font) {
      setFont(preferences.font);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="ml-0.5 text-sm">Font</span>
        <FontOptions
          value={pref?.font}
          onValueChange={(font) => {
            payloadFont.current = font;
          }}
        />
        <p className="text-muted-foreground ml-0.5 text-sm">
          Select will be shown in most places, bookmarks, folders, tags..
        </p>
      </div>
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate({ font: payloadFont.current })}
            className="w-full @lg/dash:w-46"
          >
            Save preferences
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="w-48">
            Saving changes to the database may take a few seconds before they're
            applied.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
