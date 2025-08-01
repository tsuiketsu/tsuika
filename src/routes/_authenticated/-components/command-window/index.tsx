import { commandLinks } from "./links";
import {
  CommandDialog,
  CommandList,
  CommandItem,
  CommandInput,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import useCmdkToggle from "@/hooks/cmdk-toggle.hook";
import { useFoldersData } from "@/hooks/use-folder";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, FolderIcon } from "lucide-react";

export default function CommandWindow() {
  const [open, setOpen] = useCmdkToggle();
  const navigate = useNavigate();

  const run = (command: () => void) => () => {
    setOpen(false);
    command();
  };

  const { folders } = useFoldersData();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commandLinks.map((cmdItem, idx) => (
          <CommandGroup key={`main-${idx}`} heading={cmdItem.title}>
            {cmdItem.items.map((item, idx) => {
              if (item.link) {
                return (
                  <CommandItem
                    key={`${item.title}-${item.link.to}-${idx}`}
                    onSelect={run(() => navigate(item.link))}
                  >
                    {item.icon ? <item.icon /> : <ArrowRight />}
                    {item.title}
                  </CommandItem>
                );
              }

              item.items.map((subItem, idx) => (
                <CommandItem
                  key={`${subItem.title}-${subItem.link.to}-${idx}`}
                  onSelect={run(() => navigate(subItem.link))}
                >
                  <ArrowRight />
                  {cmdItem.title}
                  <ChevronRight />
                  {subItem.title}
                </CommandItem>
              ));
            })}
          </CommandGroup>
        ))}

        {/* FOLDERS */}
        {folders.length > 0 && (
          <CommandGroup heading="Folders">
            {folders.map((folder, idx) => (
              <CommandItem
                key={`cmd-folder-${idx}`}
                onSelect={run(() =>
                  navigate({
                    to: "/bookmarks/$slug",
                    params: { slug: `folder/${folder.id}` },
                  })
                )}
              >
                <FolderIcon />
                {folder.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
