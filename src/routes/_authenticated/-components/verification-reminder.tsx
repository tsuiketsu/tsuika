import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { emailOtp, useSession } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export default function VerificationReminder() {
  return (
    <div className="bg-background p-1 text-sm">
      <div className="flex h-10 items-center justify-center gap-2 rounded-sm border p-2">
        <InfoDialog />
        <span>Please verify your account within 6 hours</span>
        <Verify />
      </div>
    </div>
  );
}

const Verify = () => {
  const session = useSession();
  const navigate = useNavigate();

  const email = useMemo(() => {
    return session.data?.user.email;
  }, [session.data?.user.email]);

  const errorToast = (message: string | undefined) =>
    toast.error(
      message || "Failed to send verification OTP, place try again later"
    );

  const mutation = useMutation({
    mutationKey: ["send-verification-otp"],
    mutationFn: async (email: string) => {
      return await emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
    },
    onSuccess: ({ data, error }, email) => {
      if (error || !data.success) {
        errorToast(error?.message);
        return;
      }

      toast.success(`Sent verification OTP to your email ${email}`);
      sessionStorage.setItem("pending_email", email);
      navigate({ to: "/email-verification" });
    },
    onError: (error) => errorToast(error.message),
  });

  if (!email) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="h-6" size="sm">
          Verify
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Account</AlertDialogTitle>
          <AlertDialogDescription>
            Send verification OTP to {session.data?.user.email}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            className="min-w-24"
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate(email)}
          >
            Send
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const InfoDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="size-6 sm:size-7">
          <AlertCircle size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Why is this important?</AlertDialogTitle>
          <AlertDialogDescription>
            Hey, pal! We gotta keep our servers happy without making the planet
            sweat—maybe just 1°C cooler, ya know? Plus, if your account isn’t
            verified, some sneaky goofball might sneak in and change the email
            ID associated with your account, locking you out or causing trouble!
            Oh, and heads-up: if you don’t verify your account
            <b className="text-foreground">
              {" "}
              within 6 hours, it might vanish
            </b>{" "}
            faster than a popsicle in a microwave! So, let’s keep things cool,
            safe, and secure—verify your account now!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Understood</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
