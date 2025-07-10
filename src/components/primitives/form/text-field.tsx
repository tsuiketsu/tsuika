import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";

export default function TextField<T extends FieldValues>({
  type = "input",
  fieldName,
  isHidden = false,
  control,
  placeholder,
  className,
}: {
  type?: "input" | "textarea";
  isHidden?: boolean;
  control: Control<T>;
  placeholder: string;
  fieldName: Path<T>;
  className?: string;
}) {
  const Comp = type === "input" ? Input : Textarea;

  if (isHidden) {
    return null;
  }

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field: { value, ...field } }) => (
        <FormItem>
          <FormLabel className="capitalize">{String(fieldName)}</FormLabel>
          <FormControl>
            <Comp
              type={fieldName.includes("password") ? "password" : "text"}
              value={value?.toString()}
              placeholder={placeholder}
              className={cn({ "min-h-28": type !== "input" }, className)}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
