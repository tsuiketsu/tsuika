import { commandLinks } from "./links";
import { useTheme } from "@/components/theme/context/use-theme";
import {
  CommandDialog,
  CommandList,
  CommandItem,
  CommandInput,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { useFoldersData } from "@/hooks/use-folder";
import type { Setter } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  FolderIcon,
  LaptopMinimal,
  Moon,
  Sun,
} from "lucide-react";

interface PropsType {
  open: boolean;
  setOpen: Setter<boolean>;
}

export default function CommandWindow({ open, setOpen }: PropsType) {
  const navigate = useNavigate();
  const { setTheme } = useTheme();

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

        {/* THEMES */}
        <CommandGroup heading="Theme">
          <CommandItem onSelect={run(() => setTheme("light"))}>
            <Sun />
            Light
          </CommandItem>
          <CommandItem onSelect={run(() => setTheme("dark"))}>
            <Moon />
            Dark
          </CommandItem>
          <CommandItem onSelect={run(() => setTheme("system"))}>
            <LaptopMinimal />
            System
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
