import type { PasswordFormType as FormSchema } from "../schema";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { Control } from "react-hook-form";

interface PropsType {
  control: Control<FormSchema>;
}

export default function RevokeSessions({ control }: PropsType) {
  return (
    <FormField
      control={control}
      name="revokeOtherSessions"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="w-full">
          <FormControl>
            <div className="inline-flex items-center justify-between">
              <span className="text-sm font-medium">Revoke all sessions?</span>
              <Switch checked={value} onCheckedChange={onChange} {...field} />
            </div>
          </FormControl>
          <FormDescription className="w-9/12">
            This will revoke all other logged in sessions after password is
            successfully changes
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
