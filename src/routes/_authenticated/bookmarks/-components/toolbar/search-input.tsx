import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToolbarStore } from "@/stores/toolbar.store";
import { useWindowSize } from "@uidotdev/usehooks";
import clsx from "clsx";
import { SearchIcon } from "lucide-react";
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
      <div className="relative">
        <Input
          type="text"
          className="h-10 w-58 rounded-md pl-8 @xl/dash:h-8 @xl/dash:pl-7"
          placeholder="Search..."
          onInput={(e) =>
            e.currentTarget.value.trim() === "" && onValueChange("")
          }
          {...register("query", {
            required: true,
            setValueAs: (v) => encodeURI(v),
          })}
        />
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 size-5 @xl/dash:top-2 @xl/dash:size-4" />
      </div>
    </form>
  );
}
