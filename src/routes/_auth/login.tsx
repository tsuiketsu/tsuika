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
import { signIn, type Session } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const Route = createFileRoute("/_auth/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (payload: z.infer<typeof LoginSchema>) => {
      return signIn.email(payload, {
        async onSuccess(context) {
          if (context.data.twoFactorRedirect) {
            navigate({
              to: "/verify-2fa",
            });
          }
        },
      });
    },
    onSuccess: ({ error, data }) => {
      if (error) {
        toast.error(error.message || "Login failed, Something went wrong");
        console.error(error);
        return;
      }

      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        session: data as unknown as Session,
      });

      navigate({ to: "/dashboard" });
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Let's get started with Tsuika</CardDescription>
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
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="grid gap-4 text-center">
        <Button type="submit" form="login-form" isLoading={mutation.isPending}>
          Login
        </Button>
        <span className="text-sm">
          Don't have an account yet? here{" "}
          <Button
            variant="link"
            className="px-0 underline"
            onClick={() => navigate({ to: "/register" })}
          >
            Register
          </Button>
        </span>
      </CardFooter>
    </Card>
  );
}
