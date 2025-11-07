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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailOtp, signUp } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SignUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or fewer" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be 100 characters or fewer" }),

  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be 30 characters or fewer" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});

export const Route = createFileRoute("/_auth/register")({
  component: Register,
  beforeLoad: () => {
    const host = window.location.hostname;

    if (host.includes("demo")) {
      return redirect({ to: "/login" });
    }
  },
});

function Register() {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof SignUpSchema>) => {
      return signUp.email(payload);
    },
    onSuccess: ({ error, data }, { email }) => {
      if (error) {
        toast.error(
          error.message || "Registration failed, something went wrong"
        );
        console.error(error);
        return;
      }

      const promise = new Promise((resolve, reject) => {
        emailOtp
          .sendVerificationOtp({ email, type: "email-verification" })
          .then(({ data, error }) => {
            if (error || !data.success) {
              console.error(error);
              reject();
            }
            resolve({});
          })
          .catch((error) => {
            console.error(error);
            reject();
          });
      });

      if (!data.user.emailVerified) {
        toast.promise(promise, {
          loading: "Sending verification OTP to your email",
          success: () => {
            sessionStorage.setItem("pending_email", email);
            navigate({ to: "/email-verification" });
            return "Verification OTP sent to your email";
          },
          error: "Failed to send verification OTP",
        });
      } else {
        navigate({ to: "/" });
      }
    },
    onError: (error) => toast.error(error.message || "Something went wrong!"),
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Let's get started with Tsuika</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="register-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. John Wick" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. johnwick" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. sheerwill@proton.me"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={Array.from({ length: 32 })
                        .fill("•")
                        .join(" ")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="grid gap-4 text-center">
        <Button
          type="submit"
          form="register-form"
          isLoading={mutation.isPending}
        >
          Register
        </Button>
        <span className="text-sm">
          Already have an account? Go{" "}
          <Button
            variant="link"
            className="px-0 underline"
            onClick={() => navigate({ to: "/login" })}
          >
            Login
          </Button>
        </span>
      </CardFooter>
    </Card>
  );
}
