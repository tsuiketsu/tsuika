import type { FormSchema } from "./schema";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import React from "react";
import type { Control } from "react-hook-form";
import type { z } from "zod";

interface PropsType {
  control: Control<z.infer<typeof FormSchema>>;
}

const OTPField = ({ control }: PropsType) => (
  <FormField
    control={control}
    name="pin"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
            <InputOTPGroup className="space-x-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <React.Fragment key={`otp-input-${idx}`}>
                  <InputOTPSlot
                    index={idx}
                    className="size-12 rounded-md border"
                  />
                </React.Fragment>
              ))}
            </InputOTPGroup>
          </InputOTP>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default OTPField;
