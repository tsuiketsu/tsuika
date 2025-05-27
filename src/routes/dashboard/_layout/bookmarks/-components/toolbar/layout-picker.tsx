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
import { LayoutGrid } from "lucide-react";

export default function LayoutPicker() {
  const layout = useLayoutStore((s) => s.layout);
  const setLayout = useLayoutStore((s) => s.setLayout);
  const Icon = cardsLayout?.[layout]?.icon ?? LayoutGrid;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          <Icon /> {cardsLayout[layout].label}
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
