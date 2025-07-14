import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unlockFolder } from "@/queries/share-folder.queries";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import clsx from "clsx";
import { ShieldBanIcon } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  password: string;
};

interface PropsType {
  folderId: string;
  onSuccessFunc: () => void;
}

export default function UnlockContent({ folderId, onSuccessFunc }: PropsType) {
  const { register, handleSubmit, watch } = useForm<Inputs>();

  const [errorText, setErrorText] = useState("");

  const mutation = useMutation({
    mutationKey: ["unlock-folder"],
    mutationFn: unlockFolder,
    onSuccess: () => {
      toast.success("Content unlocked!");
      onSuccessFunc();
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        setErrorText("Invalid Password");
      } else {
        setErrorText("Something went wrong, try again later");
        console.error(error);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) =>
    mutation.mutate({ id: folderId, password: data.password });

  return (
    <form
      className="flex min-h-screen flex-col items-center justify-center space-y-4 font-medium"
      onSubmit={handleSubmit(onSubmit)}
    >
      <span className="flex size-20 items-center justify-center rounded-full border">
        <ShieldBanIcon size={36} />
      </span>
      <Input
        type="password"
        placeholder="Enter password"
        className="max-w-xs"
        onInput={() => errorText && setErrorText("")}
        {...register("password", { required: true })}
      />
      <Label className={clsx("text-destructive", { hidden: !errorText })}>
        {errorText}
      </Label>
      <Button
        type="submit"
        variant="outline"
        className="w-28 rounded-full"
        isLoading={mutation.isPending}
        disabled={!watch("password")}
      >
        Unlock
      </Button>
      <pre className="font-inter text-center"></pre>
    </form>
  );
}
