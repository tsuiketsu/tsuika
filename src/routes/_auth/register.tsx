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
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const Route = createFileRoute("/_auth/register")({
  component: Register,
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
    onSuccess: ({ error }, { email }) => {
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

      toast.promise(promise, {
        loading: "Sending verification OTP to your email",
        success: () => {
          sessionStorage.setItem("pending_email", email);
          navigate({ to: "/email-verification" });
          return "Verification OTP sent to your email";
        },
        error: "Failed to send verification OTP",
      });
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
                      placeholder="• • • • • • • • • • • • • • • • • • • • • • • •"
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
          Alreay have an account? go{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
