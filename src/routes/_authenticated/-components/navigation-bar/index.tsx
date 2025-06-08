import DropdownOptions from "./dropdown-options";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NavigationBar() {
  return (
    <div className="bg-background flex h-[53px] items-center gap-2 px-2.5 pt-2">
      <SidebarTrigger />
      <div className="ml-auto inline-flex space-x-2">
        <ThemeToggle />
        <DropdownOptions />
      </div>
    </div>
  );
}
