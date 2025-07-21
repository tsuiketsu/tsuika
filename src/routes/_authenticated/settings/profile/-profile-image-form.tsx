import type { ProfileFormSchema } from ".";
import ImagePicker from "@/components/pickers/image-picker";
import Avatar from "@/components/ui/avatar";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { getPreviewUrl } from "@/utils";
import { Slot } from "@radix-ui/react-slot";
import type { Control } from "react-hook-form";

interface PropsType {
  user: ProfileFormSchema & { image: string };
  control: Control<ProfileFormSchema>;
}

export default function ProfileImageForm({ user, control }: PropsType) {
  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-4 pb-6">
              <Avatar
                src={getPreviewUrl(field.value) || user.image}
                fallback="Ray"
                className="size-20"
              />
              <div className="flex flex-col justify-center gap-2">
                <div>
                  <span className="inline-flex items-center text-sm font-medium">
                    {user.name}{" "}
                    <span className="text-muted-foreground">
                      &#40;&#64;{user.username}&#41;
                    </span>
                  </span>
                  <FormMessage />
                </div>
                <Slot className="w-28">
                  <ImagePicker
                    variant="secondary"
                    size="sm"
                    onValueChange={(value) => field.onChange(value.file)}
                  />
                </Slot>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
