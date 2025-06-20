import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { options } from "@/constants";
import { useSecureFolderStore } from "@/stores/secure-folder.store";
import type { Folder } from "@/types/folder";
import { LibSodium } from "@/utils/libsodium";
import clsx from "clsx";
import { LockIcon } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  password: string;
};

interface PropsType {
  folder: Folder;
}

export default function SecureFolder({ folder }: PropsType) {
  const [open, setOpen] = useState(true);
  const form = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.password) {
      if (folder.keyDerivation) {
        const crypto = await new LibSodium().initialize();
        const { salt, mac } = folder.keyDerivation;
        const secret = crypto.verifyAuth(data.password, salt, mac);
        if (secret.isMatching) {
          useSecureFolderStore
            .getState()
            .add({ folderId: folder.id, key: secret.key });
        } else {
          toast.error("Wrong password");
        }
      }
    }
  };

  return (
    <>
      <div
        className={clsx(
          "flex size-full flex-col items-center justify-center gap-4",
          { hidden: open }
        )}
      >
        <span className="bg-card rounded-full border p-5">
          <LockIcon size={28} />
        </span>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => setOpen(true)}
        >
          Unlock
        </Button>
      </div>
      <Modal
        form="secure-folder-form"
        title={`Unlock (${folder.name})`}
        open={open}
        onOpenChange={setOpen}
      >
        <Form {...form}>
          <form
            id="secure-folder-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={options.passwordPlaceholder}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Modal>
    </>
  );
}
