import type { WorkerRequest, WorkerResponse } from "./types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSecureFolderStore } from "@/stores/secure-folder.store";
import type { Folder } from "@/types/folder";
import { createTypedWorkerPost } from "@/utils";
import { LoaderCircle, ShieldIcon, UnlockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  password: string;
};

interface PropsType {
  folder: Folder;
}

export default function SecureFolder({ folder }: PropsType) {
  const form = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const workerRef = useRef<Worker>(null);
  const watchPassword = useWatch({ control: form.control, name: "password" });

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
  }, [folder.id]);

  const postToWorker = createTypedWorkerPost<WorkerRequest>(workerRef.current!);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const keyDerivation = folder.settings?.keyDerivation;

    if (data.password && keyDerivation) {
      setIsLoading(true);
      const { mac, salt, ...kdfOpts } = keyDerivation;
      postToWorker({ password: data.password, mac, salt, kdfOpts });
    }
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4">
      <Form {...form}>
        <form
          className="bg-card flex flex-col items-center justify-center gap-4 rounded-xl border p-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <span className="bg-card mb-3 rounded-full border p-3">
            <ShieldIcon />
          </span>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    className="min-w-58"
                    placeholder="Enter your password..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="outline"
            className="rounded-full"
            disabled={!watchPassword}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <UnlockIcon />
            )}{" "}
            {isLoading ? "Unlocking..." : "Unlock"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
