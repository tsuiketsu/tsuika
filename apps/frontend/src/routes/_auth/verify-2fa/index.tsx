import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { twoFactor } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const commonError = "Code must be 6 digits";

const formSchema = z.object({
  code: z
    .string()
    .min(6, { message: commonError })
    .max(6, { message: commonError }),
});

export const Route = createFileRoute("/_auth/verify-2fa/")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const mutation = useMutation({
    mutationKey: ["verify-totp"],
    mutationFn: async ({ code }: { code: string }) => {
      return await twoFactor.verifyTotp({ code });
    },
    onSuccess: ({ error, data }) => {
      if (error) {
        toast.error(error.message || "Login failed, Something went wrong");
        console.error(error);
        return;
      }

      toast.success(`Welcome back ${data.user.name}!`);

      navigate({
        to: "/bookmarks/$slug",
        params: { slug: "folder/unsorted" },
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="select-none">
      <CardHeader>
        <CardTitle>Verify 2FA</CardTitle>
        <CardDescription>
          Open your Authenticator app and enter 6 digit generated code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup className="space-x-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <InputOTPGroup key={`otp-input-${idx}`}>
                            <InputOTPSlot index={idx} className="size-10" />
                          </InputOTPGroup>
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="grid gap-4 text-center">
        <Button type="submit" form="login-form" isLoading={mutation.isPending}>
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
}
