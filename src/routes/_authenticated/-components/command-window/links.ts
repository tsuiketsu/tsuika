import { defaultFolders } from "@/components/app-sidebar/sections/general/bookmark-options/constants";
import type { LucideIconElement } from "@/types";
import type { LinkProps } from "@tanstack/react-router";

interface BaseItem {
  title: string;
  icon?: React.ElementType | LucideIconElement;
}

type CommandItem =
  | (BaseItem & {
      items: (BaseItem & { link: LinkProps })[];
      link?: never;
    })
  | (BaseItem & { items?: never; link: LinkProps });

interface CommandGroup {
  title: string;
  items: CommandItem[];
}

export const commandLinks: CommandGroup[] = [
  {
    title: "Bookmarks",
    items: defaultFolders,
  },
  {
    title: "Settings",
    items: [
      {
        title: "Profile",
        link: { to: "/settings/profile" },
      },
      {
        title: "Account",
        link: { to: "/settings/account" },
      },
      {
        title: "Appearance",
        link: { to: "/settings/appearance" },
      },
    ],
  },
];
