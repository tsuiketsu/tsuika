import SearchWindow from "./search-window";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToolbarStore } from "@/stores/toolbar.store";
import { useWindowSize } from "@uidotdev/usehooks";
import clsx from "clsx";
import { SearchIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type InputType = {
  query: string;
};

interface PropsType {
  slug: string;
  isFolderSecured: boolean;
  onValueChange: (value: string) => void;
}

export default function SearchInput({
  slug,
  isFolderSecured,
  onValueChange,
}: PropsType) {
  const { handleSubmit, register } = useForm<InputType>();
  const [open, setOpen] = useState(false);

  const isBulkEdit = useToolbarStore((s) => s.isBulkEdit);
  const { width } = useWindowSize();

  const onSubmit: SubmitHandler<InputType> = (data) => {
    onValueChange?.(data.query);
  };

  if (isBulkEdit && (width ?? 0) <= 480) {
    return (
      <span className={clsx(buttonVariants({ size: "icon" }))}>
        <SearchIcon />
      </span>
    );
  }

  return (
    <form
      className={clsx(
        "w-full gap-2",
        slug.includes("tag") || isFolderSecured ? "hidden" : "inline-flex"
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="bg-input/30 relative inline-flex h-9 max-w-60 items-center rounded-lg border pr-1 pl-2 sm:h-8">
        <SearchIcon className="text-muted-foreground w-5 shrink-0 sm:w-4" />
        <Input
          placeholder="Search"
          className="w-58 justify-between border-none bg-transparent pr-1 pl-2 shadow-sm hover:bg-inherit focus-visible:ring-0 dark:bg-transparent"
          {...register("query", { required: false })}
        />
        <Button
          variant="secondary"
          className="h-7 rounded-sm sm:h-6 sm:rounded-sm"
          onClick={() => setOpen(true)}
        >
          <SparklesIcon className="w-5 sm:w-4" />
        </Button>
      </div>
      <SearchWindow open={open} setOpen={setOpen} />
    </form>
  );
}
