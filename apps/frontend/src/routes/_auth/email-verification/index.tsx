import EmailVerificationForm from "./-components/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserVerificationEmail } from "@/queries/auth.queries";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_auth/email-verification/")({
  component: EmailVerification,
  validateSearch: (search) =>
    search as {
      token?: string;
    },
  loaderDeps: ({ search: { token } }) => ({ token }),
  loader: async ({ deps: { token } }) => {
    const email = sessionStorage.getItem("pending_email");

    if (email) {
      return { email };
    }

    if (token) {
      const response = await getUserVerificationEmail(token);
      return { email: response.email };
    }

    return { email: null };
  },
});

function EmailVerification() {
  const search = Route.useLoaderData();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!email) {
      if (search.email) {
        setEmail(search.email);
      }
    }
  }, [email, search.email]);

  if (!email) {
    return (
      <Card className="mx-4 w-full sm:w-md">
        <CardHeader>
          <CardTitle>Email Verification Session Expired</CardTitle>
          <CardDescription>
            Your email verification session has expired. This can happen if the
            page was refreshed, the browser was closed, or too much time has
            passed. Please check your inbox and use the verification link to
            continue.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="ml-auto w-28" asChild>
            <Link to="/">Unserstood</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Please enter the one-time password sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailVerificationForm email={email} />
      </CardContent>
    </Card>
  );
}
