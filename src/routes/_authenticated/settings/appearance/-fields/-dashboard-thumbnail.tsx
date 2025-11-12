import Image from "@/components/image";
import ImagePicker from "@/components/pickers/image-picker";
import {
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import type { Preferences } from "@/types/profile";
import { getPreviewUrl } from "@/utils";
import type { Control } from "react-hook-form";

interface PropsType {
  control: Control<Preferences>;
}

export default function DashboardThumbnail({ control }: PropsType) {
  return (
    <FormField
      control={control}
      name="dashboardThumbnail"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="ml-0.5">Font</FormLabel>
          <Image
            src={
              field.value
                ? field.value instanceof File
                  ? (getPreviewUrl(field.value) ?? undefined)
                  : field.value
                : undefined
            }
            alt=""
            className="w-full @lg/dash:max-w-sm"
          />
          <FormControl>
            <ImagePicker
              variant="secondary"
              onValueChange={(value) => field.onChange(value.file)}
              className="w-full @lg/dash:w-46"
            />
          </FormControl>
          <FormDescription>
            Select will be shown in most places, bookmarks, folders, tags..
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
