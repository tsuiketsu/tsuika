import HomeTab from "./home-tab";
import TagsTab from "./tags-tab";
import { Button } from "@/components/ui/button";
import { SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash, Home } from "lucide-react";
import { lazy, Suspense, useState } from "react";

const InsertFolder = lazy(
  () => import("@/components/forms/folder/insert-folder")
);
const InsertTag = lazy(() => import("@/components/forms/tag/insert-tag"));

const tabs = [
  { label: "home", icon: Home },
  { label: "tags", icon: Hash },
];

const SelectedTab = ({ tabIndex }: { tabIndex: number }) => {
  if (tabIndex === 1) {
    return <TagsTab />;
  }

  return <HomeTab />;
};

const ButtonFallback = () => (
  <Skeleton className="size-6 rounded-sm bg-black/10" />
);

const ActionButton = ({ tabIndex }: { tabIndex: number }) => {
  if (tabIndex === 0) {
    return (
      <Suspense fallback={<ButtonFallback />}>
        <InsertFolder />
      </Suspense>
    );
  }

  if (tabIndex === 1) {
    return (
      <Suspense fallback={<ButtonFallback />}>
        <InsertTag />
      </Suspense>
    );
  }
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
          <ActionButton tabIndex={tabIndex} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SelectedTab tabIndex={tabIndex} />
      </SidebarContent>
    </>
  );
}
