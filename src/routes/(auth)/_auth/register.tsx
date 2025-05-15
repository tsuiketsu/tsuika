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
import { signUp } from "@/lib/auth-client";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { type } from "arktype";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignUpSchema = type({
  name: "string",
  email: "string.email",
  password: "string",
});

export const Route = createFileRoute("/(auth)/_auth/register")({
  component: Register,
});

function Register() {
  const form = useForm<type.infer<typeof SignUpSchema>>({
    resolver: arktypeResolver(SignUpSchema),
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (payload: type.infer<typeof SignUpSchema>) => {
      return signUp.email(payload);
    },
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(
          error.message || "Registration failed, something went wrong",
        );
        console.error(error);
        return;
      }
      navigate({ to: "/dashboard" });
    },
  });

  async function onSubmit(values: type.infer<typeof SignUpSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Let's get started with Tsuika</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {mutation.isPending && <div>Loading...</div>}
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
      <CardFooter className="grid text-center gap-4">
        <Button form="register-form" isLoading={mutation.isPending}>
          Register
        </Button>
        <span className="text-sm">
          Alreay have an account? go{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
