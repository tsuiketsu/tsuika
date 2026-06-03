import { ZodString, z } from "zod";

const requiredString = (schema: ZodString, message = "Required") => {
  return schema.refine((val) => val !== "", { message });
};

export const passwordFormScheme = z.object({
  password: z
    .object({
      currentPassword: requiredString(z.string()),
      newPassword: requiredString(z.string()),
      confirmNewPassword: requiredString(z.string()),
    })
    .refine((value) => value.currentPassword !== value.newPassword, {
      message: "New password cannot be the same as the current password",
      path: ["newPassword"],
    })
    .refine((value) => value.newPassword === value.confirmNewPassword, {
      message: "Password do not match.",
      path: ["confirmNewPassword"],
    }),
  revokeOtherSessions: z.boolean(),
});

export type PasswordFormType = z.infer<typeof passwordFormScheme>;
