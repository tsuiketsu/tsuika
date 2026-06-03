import type { LucideIconElement } from "@/types";
import type { LinkProps } from "@tanstack/react-router";
import { Star, Inbox, Archive, LibraryBig } from "lucide-react";

type Folder = {
  title: string;
  description: string;
  icon: LucideIconElement;
  link: LinkProps;
};

export const defaultFolders: Folder[] = [
  {
    title: "All Bookmarks",
    description: "Bookmarks chosen for quick access to top sites.",
    link: { to: "/bookmarks/$slug", params: { slug: "folder/all" } },
    icon: LibraryBig,
  },
  {
    title: "Favorites",
    description: "Bookmarks chosen for quick access to top sites.",
    link: { to: "/bookmarks/$slug", params: { slug: "folder/favorites" } },
    icon: Star,
  },
  {
    title: "Archived",
    description: "Bookmarks saved for reference, not actively used",
    link: { to: "/bookmarks/$slug", params: { slug: "folder/archived" } },
    icon: Archive,
  },
  {
    title: "Unsorted",
    description:
      "Bookmarks automatically saved here without user categorization, acting as a default holding area for later organization",
    link: { to: "/bookmarks/$slug", params: { slug: "folder/unsorted" } },
    icon: Inbox,
  },
];

export const getDefaultFoldersSlug = (): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return defaultFolders.map((f: any) => f.link.params.slug) ?? [];
};
