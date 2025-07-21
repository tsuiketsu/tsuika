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
  defaultValue: string;
  control: Control<ProfileFormSchema>;
}

const avatarPlaceholder = "https://placehold.co/100x100";

export default function ProfileImageForm({ defaultValue, control }: PropsType) {
  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-4 pb-6">
              <Avatar
                src={
                  getPreviewUrl(field.value) ||
                  defaultValue ||
                  avatarPlaceholder
                }
                fallback="Ray"
                className="size-20"
              />
              <div className="flex flex-col gap-3">
                <div>
                  <span className="font-bold">Profile Photo</span>
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
