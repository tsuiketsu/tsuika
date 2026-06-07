import { LayoutGrid } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLayoutStore, {
  type CardsLayoutKey,
  cardsLayout,
} from "@/stores/layout.store";
import { useToolbarStore } from "@/stores/toolbar.store";

export default function LayoutPicker() {
  const id = useId();
  const layout = useLayoutStore((s) => s.layout);
  const isBulkEdit = useToolbarStore((s) => s.isBulkEdit);
  const setLayout = useLayoutStore((s) => s.setLayout);
  const selectedLayout = cardsLayout?.[layout];
  const Icon = selectedLayout?.icon ?? LayoutGrid;

  if (isBulkEdit) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(cardsLayout).map(([key, value], idx) => (
          <DropdownMenuItem
            key={`${id}-${idx}`}
            className="capitalize"
            onClick={() => setLayout(key as CardsLayoutKey)}
          >
            {value.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
