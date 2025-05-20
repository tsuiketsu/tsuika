import FolderPicker from "@/components/folder-picker";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { BookmarkFormSchemaType } from "@/types/bookmark";
import type { Control } from "react-hook-form";

interface PropsType {
  control: Control<BookmarkFormSchemaType>;
}

export default function FolderOptions({ control }: PropsType) {
  return (
    <FormField
      control={control}
      name="folderId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Folder <span className="text-foreground/60">(optional)</span>
          </FormLabel>
          <FormControl>
            <FolderPicker value={field?.value} onChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
