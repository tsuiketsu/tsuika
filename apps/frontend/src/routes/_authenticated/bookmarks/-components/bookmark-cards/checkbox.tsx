import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import useLayoutStore, { cardLayout } from "@/stores/layout.store";
import { useToolbarStore } from "@/stores/toolbar.store";

interface PropsType {
  bookmarkId: string;
}

export default function BookmarkCheckbox(props: PropsType) {
  const layout = useLayoutStore((s) => s.layout);
  const addId = useToolbarStore((s) => s.addBookmarkId);
  const bookmarkIds = useToolbarStore((s) => s.bookmarkIds);

  const onCheck = () => {
    addId(props.bookmarkId);
  };

  return (
    <>
      <Checkbox
        checked={bookmarkIds.some((id) => id === props.bookmarkId)}
        onCheckedChange={onCheck}
        className={cn(
          "data-[state=checked]:bg-destructive dark:data-[state=checked]:bg-destructive data-[state=checked]:border-desctructive border-destructive absolute top-4 left-4 z-2 size-5 border-2 bg-white dark:bg-white",
          { "top-2 left-2": layout === cardLayout.COMPACT }
        )}
      />
      <button
        type="button"
        className="bg-foreground/40 absolute inset-0 z-1 cursor-pointer"
        aria-label="toggle-checked-button"
        onClick={onCheck}
      />
    </>
  );
}
