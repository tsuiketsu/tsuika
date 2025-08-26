import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { relockFolder } from "@/queries/share-folder.queries";
import LayoutPicker from "@/routes/_authenticated/bookmarks/-components/toolbar/layout-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LockIcon } from "lucide-react";
import { toast } from "sonner";

interface PropsType {
  folderId: string;
  isLocked: boolean;
  queryKey: unknown[];
}

export default function Header({ folderId, isLocked, queryKey }: PropsType) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["relock-folder"],
    mutationFn: relockFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });

  return (
    <div className="inline-flex w-full justify-between border-b py-4">
      <span className="text-lg font-bold">Tsuika</span>
      <div className="inline-flex items-center gap-2">
        {folderId && isLocked && (
          <Button
            variant="outline"
            onClick={() => mutation.mutate(folderId)}
            isLoading={mutation.isPending}
            className="min-w-26"
          >
            <LockIcon /> Re-Lock
          </Button>
        )}
        <LayoutPicker />
        <ThemeToggle />
      </div>
    </div>
  );
}
