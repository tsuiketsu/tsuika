import IconCard from "./_shared/icon-card";
import { fetchTotalBookmarksCount } from "@/queries/bookmark.queries";
import { fetchTotalFoldersCount } from "@/queries/folder.queries";
import { fetchTotalTagsCount } from "@/queries/tags.queries";
import { Bookmark, Folders, Pin, Hash } from "lucide-react";
import { useEffect, useReducer, useState } from "react";

const initialStats = {
  bookmarks: { icon: Bookmark, count: 0 },
  folders: { icon: Folders, count: 0 },
  tags: { icon: Hash, count: 0 },
  pinned: { icon: Pin, count: 0 },
};

type ActionFlag = keyof typeof initialStats;

const statsReducer = (
  state: typeof initialStats,
  action: {
    flag: ActionFlag;
    payload: number;
  }
) => {
  return {
    ...state,
    [action.flag]: {
      ...state[action.flag],
      count: action.payload,
    },
  };
};

export default function BookmarkStats() {
  const [stats, dispatch] = useReducer(statsReducer, initialStats);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      Promise.all([
        fetchTotalBookmarksCount(),
        fetchTotalFoldersCount(),
        fetchTotalTagsCount(),
        fetchTotalBookmarksCount("pinned"),
      ])
        .then((responses) => {
          (Object.keys(initialStats) as ActionFlag[]).forEach((key, idx) => {
            dispatch({ flag: key, payload: responses[idx].total });
          });
        })
        .finally(() => setIsLoading(false));
    })();
  }, []);

  return (
    <div className="grid w-full grid-cols-2 gap-4 pt-4 @xl/dash:grid-cols-4">
      {Object.entries(stats).map(([label, item]) => (
        <IconCard
          key={`stat-${label}`}
          isFetching={isLoading}
          count={item.count}
          label={label}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
