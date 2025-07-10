import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
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

  const childCount = React.Children.count(children);
  const Comp = childCount > 1 ? "div" : Slot;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TriggerButton />
      <DialogContent className="select-none">
        <DialogHeader
          className={clsx("text-left", { hidden: props?.isHeaderHidden })}
        >
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Comp className={clsx(childCount > 1 && "flex flex-col gap-4")}>
          {children}
        </Comp>
        <DialogFooter
          className={clsx("pt-6", { hidden: props.isFooterHidden })}
        >
          <DialogClose asChild>
            <Button variant="secondary" className="w-24">
              Close
            </Button>
          </DialogClose>
          <SuccessButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
