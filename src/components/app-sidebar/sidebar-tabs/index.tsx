import { Button } from "@/components/ui/button";
import { SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { Hash, Home } from "lucide-react";
import { useState } from "react";
import HomeTab from "./home-tab";
import TagsTab from "./tags-tab";
import InsertTag from "@/components/forms/tag/insert-tag";

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

const ActionButton = ({ tabIndex }: { tabIndex: number }) => {
  if (tabIndex === 1) {
    return <InsertTag />;
  }

  return null;
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
