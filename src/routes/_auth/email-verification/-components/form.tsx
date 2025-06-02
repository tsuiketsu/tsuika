import OTPField from "./otp-field";
import { FormSchema } from "./schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { emailOtp } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface PropsType {
  email: string;
}
export default function EmailVerificationForm({ email }: PropsType) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const promise = new Promise((resolve, reject) => {
      emailOtp.verifyEmail({ email, otp: data.pin }).then(({ data, error }) => {
        if (!error && data.user.emailVerified) {
          resolve({});
        }
        reject();
      });
    });

    toast.promise(promise, {
      loading: `Verifying your email`,
      success: () => {
        setTimeout(() => window.location.reload(), 2000);
        return "Email verification successfull :)";
      },
      error: "Failed to verify email :(",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center justify-center space-y-6"
      >
        <OTPField control={form.control} />
        <Button type="submit" className="ml-auto min-w-28">
          Verify
        </Button>
      </form>
    </Form>
  );
}
