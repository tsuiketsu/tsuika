import { Star, Inbox, Archive } from "lucide-react";

export const defaultFolders = [
  {
    title: "Favorites",
    description: "Bookmarks chosen for quick access to top sites.",
    url: "favorites",
    icon: Star,
  },
  {
    title: "Unsorted",
    description:
      "Bookmarks automatically saved here without user categorization, acting as a default holding area for later organization",
    url: "unsorted",
    icon: Inbox,
  },
  {
    title: "Archived",
    description: "Bookmarks saved for reference, not actively used",
    url: "archived",
    icon: Archive,
  },
];
