import type { LucideIconElement } from "@/types";
import type { LinkProps } from "@tanstack/react-router";
import { Star, Inbox, Archive } from "lucide-react";

type Folder = {
  title: string;
  description: string;
  icon: LucideIconElement;
  link: LinkProps;
};

export const defaultFolders: Folder[] = [
  {
    title: "Favorite Bookmarks",
    description: "Bookmarks chosen for quick access to top sites.",
    link: { to: "/bookmarks/$slug", params: { slug: "folder/favourites" } },
    icon: Star,
  },
  {
    title: "Archived Bookmarks",
    description: "Bookmarks saved for reference, not actively used",
    link: { to: "/bookmarks/$slug", params: { slug: "folder/archived" } },
    icon: Archive,
  },
  {
    title: "Unsorted Bookmarks",
    description:
      "Bookmarks automatically saved here without user categorization, acting as a default holding area for later organization",
    link: { to: "/bookmarks/$slug", params: { slug: "folder/unsorted" } },
    icon: Inbox,
  },
];
