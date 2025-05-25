import TagForm from "./tag-form";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import useTagInsertMutation from "@/hooks/insert-tag-mutation.hook";
import { Plus } from "lucide-react";
import { useRef } from "react";

export default function InsertTag() {
  const ref = useRef<HTMLButtonElement>(null);

  const mutation = useTagInsertMutation(ref);

  return (
    <Modal
      form="tag-form"
      title="Create Tag"
      desc="When you're happy with it, just hit the Create button"
      triggerButton={
        <Button ref={ref} variant="ghost" className="size-8">
          <Plus size={20} />
        </Button>
      }
      isPending={mutation.isPending}
      btnTxt="Create"
    >
      <TagForm onSubmit={mutation.mutate} />
    </Modal>
  );
}
