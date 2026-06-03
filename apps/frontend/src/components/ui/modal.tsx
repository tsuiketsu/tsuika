import { Button } from "./button";
import { DialogTrigger } from "./dialog";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetDescription,
  SheetContent,
  SheetClose,
} from "./sheet";
import React from "react";

interface ModalProps {
  isHeaderHidden?: boolean;
  isFooterHidden?: boolean;
  title?: string | React.ReactNode;
  desc?: string;
  open?: boolean;
  onOpenChange?: (state: boolean) => void;
  children: React.ReactNode;
  btnFunc?: () => void;
  btnTxt?: string;
  form?: string;
  isPending?: boolean;
  successButton?: React.ReactNode;
  triggerButton?: React.ReactNode;
}

const Modal = ({ children, open, onOpenChange, ...props }: ModalProps) => {
  const {
    title = "",
    desc = "",
    btnFunc,
    btnTxt,
    form = undefined,
    isPending = false,
    successButton,
    triggerButton,
  } = props;

  const SuccessButton = () =>
    successButton ??
    (btnFunc || form ? (
      <Button
        type={form ? "submit" : "button"}
        form={form}
        onClick={btnFunc}
        isLoading={isPending}
        className="min-w-24 capitalize"
      >
        {btnTxt ?? "Save"}
      </Button>
    ) : (
      <></>
    ));

  const TriggerButton = () =>
    triggerButton ? (
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
    ) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <TriggerButton />
      <SheetContent className="xs:max-w-sm w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="capitalize">{title}</SheetTitle>
          <SheetDescription>{desc}</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">{children}</div>
        <SheetFooter>
          <SuccessButton />
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Modal;
