import BulkEdit from "./bulk-edit";
import LayoutPicker from "./layout-picker";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { SearchIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";

interface PropsType {
  slug: string;
  total: number;
  onQueryChange: (value: string) => void;
}

type InputType = {
  query: string;
};

export default function ActionBar({ slug, total, onQueryChange }: PropsType) {
  const { handleSubmit, register } = useForm<InputType>();

  const onSubmit: SubmitHandler<InputType> = (data) => {
    onQueryChange?.(data.query);
  };

  return (
    <div className="flex items-center gap-4 pb-4">
      <form
        className={clsx(
          "w-full gap-2",
          slug.includes("tag") ? "hidden" : "inline-flex"
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative">
          <Input
            type="text"
            className="h-8 w-58 pl-7"
            placeholder="Search..."
            onInput={(e) =>
              e.currentTarget.value.trim() === "" && onQueryChange("")
            }
            {...register("query", {
              required: true,
              setValueAs: (v) => encodeURI(v),
            })}
          />
          <SearchIcon
            className="text-muted-foreground absolute top-2 left-2"
            size={16}
          />
        </div>
      </form>
      <span
        className={clsx(
          "bg-secondary rounded-sm px-3 py-1 text-sm whitespace-nowrap",
          {
            hidden: !slug.includes("tag"),
          }
        )}
      >
        Showing {total} results
      </span>
      <div className="ml-auto inline-flex w-full items-center justify-end space-x-2">
        <BulkEdit />
        <LayoutPicker />
      </div>
    </div>
  );
}
