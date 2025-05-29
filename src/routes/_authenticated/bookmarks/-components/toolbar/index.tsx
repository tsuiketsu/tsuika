import LayoutPicker from "./layout-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Search } from "lucide-react";
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
    <div className="flex items-center justify-between pb-4">
      <form
        className={clsx(
          "gap-2",
          slug.includes("tag") ? "hidden" : "inline-flex"
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="text"
          className="max-w-xs"
          placeholder="Filter Bookmarks"
          onInput={(e) =>
            e.currentTarget.value.trim() === "" && onQueryChange("")
          }
          {...register("query", {
            required: true,
            setValueAs: (v) => encodeURI(v),
          })}
        />
        <Button type="submit" variant="outline" size="icon">
          <Search />
        </Button>
      </form>
      <span className={clsx({ hidden: !slug.includes("tag") })}>
        Showing <b>{total}</b> results
      </span>
      <div className="ml-auto">
        <LayoutPicker />
      </div>
    </div>
  );
}
