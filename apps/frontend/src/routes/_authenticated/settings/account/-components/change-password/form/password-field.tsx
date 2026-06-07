import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { NestedPathsOnly } from "@/types";
import type { PasswordFormType as FormSchema } from "../schema";

interface PropsType {
  control: Control<FormSchema>;
  isDisabled?: boolean;
  title: string;
  placeholder: string;
  fieldName: NestedPathsOnly<FormSchema>;
}

export default function PasswordField({
  control,
  isDisabled = false,
  title,
  placeholder,
  fieldName,
}: PropsType) {
  return (
    <FormField
      control={control}
      name={fieldName}
      disabled={isDisabled}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{title}</FormLabel>
          <FormControl>
            <Input type="password" placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
