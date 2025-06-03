import CopyText from "../copy-text";
import QrCode from "../qr-code";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Hr from "@/components/ui/hr";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { twoFactor } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

interface InputType {
  otp: string;
}

interface PropsType {
  totpURI: string;
  onValueChange?: (value: boolean) => void;
}

const VerificationTab = ({ totpURI, onValueChange }: PropsType) => {
  const form = useForm<InputType>();

  const errorToast = (message?: string) =>
    toast(message || "Failed to verify TOTP");

  const mutation = useMutation({
    mutationKey: ["verify-totp"],
    mutationFn: async (code: string) => {
      return await twoFactor.verifyTotp({
        code,
      });
    },

    onSuccess: ({ error }) => {
      if (error) {
        errorToast(error.message);
        return;
      }

      toast.success("Successfully verified TOTP");
      onValueChange?.(true);
    },
    onError: (error) => errorToast(error.message),
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    mutation.mutate(data.otp);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Set Up Two-Factor Auth</DialogTitle>
        <DialogDescription>
          Scan the QR code below with your authentication app (eg. ente, aegis)
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <QrCode value={totpURI} />
        <Hr text="or enter code manually" />
        <CopyText text={totpURI} />
        <Hr text="enter 6 digit generated code" />
        <Form {...form}>
          <form
            id="totp-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <InputOTPGroup key={`otp-group-${idx}`}>
                        <InputOTPSlot index={idx} />
                      </InputOTPGroup>
                    ))}
                  </InputOTP>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <hr className="w-full" />
      <DialogFooter>
        <Button
          type="submit"
          isLoading={mutation.isPending}
          form="totp-form"
          className="w-full"
        >
          Verify TOTP
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default VerificationTab;
