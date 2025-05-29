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
import { signIn } from "@/lib/auth-client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { type } from "arktype";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginSchema = type({
  email: "string.email",
  password: "string",
});

export const Route = createFileRoute("/_auth/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  const form = useForm<type.infer<typeof LoginSchema>>({
    resolver: arktypeResolver(LoginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (payload: type.infer<typeof LoginSchema>) => {
      return signIn.email(payload);
    },
    onSuccess: ({ error, data }) => {
      if (error) {
        toast.error(error.message || "Login failed, Something went wrong");
        // eslint-disable-next-line no-console
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

  async function onSubmit(values: type.infer<typeof LoginSchema>) {
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
                      placeholder="• • • • • • • • • • • • • • • • • • • • • • • •"
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
        <Button form="login-form" isLoading={mutation.isPending}>
          Login
        </Button>
        <span className="text-sm">
          Don't have an account yet? here{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
