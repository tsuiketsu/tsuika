import type { WorkerRequest, WorkerResponse } from "./types";
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
import { createTypedWorkerPost, objectPick } from "@/utils";
import clsx from "clsx";
import { LockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });

    workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
      if (e.data.status === "success") {
        useSecureFolderStore.getState().add({
          folderId: folder.id,
          key: e.data.key,
        });
        toast.success("Unlocked!");
      } else {
        toast.error(e.data.message);
      }

      setIsLoading(false);
    };

    workerRef.current.onerror = (e) => {
      console.error("secure-folder worker error", e.error);
      toast.error("Something went wrong, fail to unlock!");
      setIsLoading(false);
    };

    return () => {
      workerRef.current?.terminate();
      setIsLoading(false);
    };
  }, [folder.id, folder.keyDerivation?.nonce]);

  const postToWorker = createTypedWorkerPost<WorkerRequest>(workerRef.current!);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.password && folder.keyDerivation) {
      setIsLoading(true);
      const { mac, salt } = folder.keyDerivation;

      const kdfOpts = Object.fromEntries(
        Object.entries(
          objectPick(folder.keyDerivation, [
            "kdf_opslimit",
            "kdf_memlimit",
            "kdf_algorithm",
          ])
        ).map(([key, value]) => [key.split("_").slice(-1)[0], value])
      );

      postToWorker({ password: data.password, mac, salt, kdfOpts });
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
        isPending={isLoading}
        btnTxt="Unlock"
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
