import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Setter } from "@/lib/utils";
import { useForm, type SubmitHandler } from "react-hook-form";

interface PropsType {
  open?: boolean;
  setOpen?: Setter<boolean>;
  isLoading?: boolean;
  onValueChange?: (value: string) => void;
}

interface InputType {
  password: string;
}

const PasswordInput = ({
  open,
  setOpen,
  isLoading,
  onValueChange,
}: PropsType) => {
  const { register, handleSubmit } = useForm<InputType>();

  const onSubmit: SubmitHandler<InputType> = ({ password }) => {
    onValueChange?.(password);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🐧 Sudo Password</DialogTitle>
          <DialogDescription>
            Confirm your identity with your password to update account settings
            or other sensitive data.
          </DialogDescription>
        </DialogHeader>
        <form id="password-form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="password"
            className="h-10 placeholder:text-xl"
            placeholder={Array.from({ length: 34 })
              .map((_) => "•")
              .join(" ")}
            {...register("password", { required: true })}
          />
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="password-form"
            isLoading={isLoading}
            className="min-w-24"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordInput;
