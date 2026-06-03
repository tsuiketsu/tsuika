import CommandWindow from "../command-window";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useCmdkToggle from "@/hooks/cmdk-toggle.hook";
import { CommandIcon, SearchIcon } from "lucide-react";

export default function CommandWindowComponent() {
  const [open, setOpen] = useCmdkToggle();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden w-58 justify-between pr-2 pl-2 shadow-sm hover:bg-inherit sm:pr-1 @xl/n:inline-flex"
        onClick={() => setOpen(true)}
      >
        <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
          <SearchIcon size={18} />
          Search...
        </span>
        <Badge variant="secondary" className="invisible gap-1 sm:visible">
          <CommandIcon style={{ width: 13 }} /> <span>+</span> <span>k</span>
        </Badge>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="@xl/n:hidden"
      >
        <CommandIcon />
      </Button>
      <CommandWindow open={open} setOpen={setOpen} />
    </>
  );
}
