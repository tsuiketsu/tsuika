import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLayoutStore, {
  cardsLayout,
  type CardsLayoutKey,
} from "@/stores/layout.store";
import { useToolbarStore } from "@/stores/toolbar.store";
import { LayoutGrid } from "lucide-react";

export default function LayoutPicker() {
  const layout = useLayoutStore((s) => s.layout);
  const isBulkEdit = useToolbarStore((s) => s.isBulkEdit);
  const setLayout = useLayoutStore((s) => s.setLayout);
  const selectedLayout = cardsLayout?.[layout];
  const Icon = selectedLayout?.icon ?? LayoutGrid;
  const label = selectedLayout?.label;

  if (isBulkEdit) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          <Icon /> {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(cardsLayout).map(([key, value]) => (
          <DropdownMenuItem
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
