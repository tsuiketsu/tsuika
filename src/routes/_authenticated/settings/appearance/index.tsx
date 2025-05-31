import FontOptions from "./-font-options";
import { usePreferencesMutation } from "./-hooks/mutation.hook";
import { preferencesReduces } from "./-utils/reducer.utils";
import { useFont } from "@/components/font/context/use-font";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createFileRoute } from "@tanstack/react-router";
import { useReducer } from "react";

export const Route = createFileRoute("/_authenticated/settings/appearance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { font } = useFont();

  const [preferences, dispatch] = useReducer(preferencesReduces, { font });
  const mutation = usePreferencesMutation(preferences);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="ml-0.5 text-sm">Font</span>
        <FontOptions
          value={font}
          onValueChange={(e) => dispatch({ type: "SET_FONT", payload: e })}
        />
        <p className="text-muted-foreground ml-0.5 text-sm">
          Select will be shown in most places, bookmarks, folders, tags..
        </p>
      </div>

      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate({ font })}
            className="w-48"
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
