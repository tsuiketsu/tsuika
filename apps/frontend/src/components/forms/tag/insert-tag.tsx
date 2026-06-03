import TagForm from "./tag-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import useTagInsertMutation from "@/hooks/insert-tag-mutation.hook";
import { Slot } from "@radix-ui/react-slot";
import React, { useRef } from "react";

interface PropsType {
  customTrigger?: React.ReactElement<React.ComponentProps<"button">>;
}

export default function InsertTag({ customTrigger }: PropsType) {
  const ref = useRef<HTMLButtonElement>(null);

  const mutation = useTagInsertMutation({
    onSuccess: () => ref.current?.click(),
  });

  return (
    <Modal
      form="tag-form"
      title="Create Tag"
      desc="When you're happy with it, just hit the Create button"
      triggerButton={
        customTrigger ? (
          <Slot ref={ref}>{customTrigger}</Slot>
        ) : (
          <Button variant="ghost" className="size-8" ref={ref} />
        )
      }
      isPending={mutation.isPending}
      btnTxt="Create"
    >
      <TagForm onSubmit={mutation.mutate} />
    </Modal>
  );
}
