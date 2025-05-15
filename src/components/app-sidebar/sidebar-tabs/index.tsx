import { Button } from "@/components/ui/button";
import { SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash, Home, Plus } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import HomeTab from "./home-tab";

const TagsTab = lazy(() => import("./tags-tab"));

const tabs = [
  { label: "home", icon: Home },
  { label: "tags", icon: Hash },
];

const SelectedTab = ({ tabIndex }: { tabIndex: number }) => {
  if (tabIndex === 1) {
    return (
      <Suspense
        fallback={
          <div className="space-y-2 px-3">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton
                key={`tag-skeleton-${idx}`}
                className="w-full h-6 rounded"
              />
            ))}
          </div>
        }
      >
        <TagsTab />
      </Suspense>
    );
  }

  return <HomeTab />;
};

export default function SidebarTabs() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <SidebarHeader className="inline">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="space-x-2">
            {tabs.map((item, idx) => (
              <Button
                variant={tabIndex === idx ? "secondary" : "ghost"}
                key={item.label}
                size="icon"
                className="size-8"
                onClick={() => setTabIndex(idx)}
              >
                <item.icon />
              </Button>
            ))}
          </div>
          <Button variant="ghost" className="size-8">
            <Plus size={20} />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SelectedTab tabIndex={tabIndex} />
      </SidebarContent>
    </>
  );
}
