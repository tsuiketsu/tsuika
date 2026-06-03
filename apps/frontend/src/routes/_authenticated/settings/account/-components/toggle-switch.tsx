import type { TOTP } from "./two-factor-form/types";
import LazyBoundary from "@/components/lazy-boundary";
import Show from "@/components/show";
import { Switch } from "@/components/ui/switch";
import { twoFactor, useSession } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { lazy, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const TwoFactorForm = lazy(() => import("./two-factor-form"));
const PasswordInput = lazy(() => import("@/components/password-input"));

export default function ToggleTwoFactor() {
  const { data, isPending, error } = useSession();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [totpDetails, setTotpDetails] = useState<TOTP | null>(null);

  useEffect(() => {
    setEnabled(data?.user.twoFactorEnabled ?? false);
  }, [data]);

  const enableMutation = useMutation({
    mutationKey: ["enable-2fa"],
    mutationFn: async (password: string) => {
      return await twoFactor.enable({
        password,
        issuer: "Tsuika",
      });
    },
    onSuccess: ({ data, error }) => {
      if (error) {
        toast.error(error.message);
        return;
      }

      setOpen(false);
      setTotpDetails(data);
    },
    onError: (error) => toast.error(error.message || "Failed to enable 2FA"),
  });

  const disableMutation = useMutation({
    mutationKey: ["disable-2fa"],
    mutationFn: async (password: string) => {
      return await twoFactor.disable({ password });
    },
    onSuccess: ({ data, error }) => {
      if (error || !data.status) {
        toast.error(error?.message || "Failed to disable 2FA");
        return;
      }

      toast.success("Successfully disabled 2FA");
      setEnabled(false);
      setOpen(false);
    },
    onError: (error) => toast.error(error.message || "Failed to disable 2FA"),
  });

  const isLoading = useMemo(() => {
    if (!data?.user.twoFactorEnabled) {
      return enableMutation.isPending;
    }
    return disableMutation.isPending;
  }, [
    data?.user.twoFactorEnabled,
    disableMutation.isPending,
    enableMutation.isPending,
  ]);

  const onPasswordSubmit = (password: string) => {
    const user = data?.user;
    if (!user) return;

    if (!user.twoFactorEnabled) {
      enableMutation.mutate(password);
      return;
    }

    disableMutation.mutate(password);
  };

  if (error) {
    return null;
  }

  return (
    <div className="space-y-1">
      <div
        className={
          "inline-flex w-full justify-between rounded-sm text-sm font-medium"
        }
      >
        Two-factor Authentication
        {isPending ? (
          <LoaderCircle className="animate-spin" size={18} />
        ) : (
          <Switch onClick={() => setOpen(true)} checked={enabled} />
        )}
      </div>
      <p className="text-muted-foreground w-9/12 text-xs">
        Auth app code required for login and account changes.
      </p>
      <LazyBoundary>
        <Show when={open}>
          <PasswordInput
            open={open}
            setOpen={setOpen}
            isLoading={isLoading}
            onValueChange={onPasswordSubmit}
          />
        </Show>
      </LazyBoundary>
      <LazyBoundary>
        {totpDetails && (
          <TwoFactorForm
            open={!!setTotpDetails}
            onOpenChange={(value) => value === false && setTotpDetails(null)}
            {...totpDetails}
          />
        )}
      </LazyBoundary>
    </div>
  );
}
