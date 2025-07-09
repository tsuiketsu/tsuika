import { ThemeToggle } from "@/components/theme/theme-toggle";
import LayoutPicker from "@/routes/_authenticated/bookmarks/-components/toolbar/layout-picker";

export default function Header() {
  return (
    <div className="inline-flex w-full justify-between border-b py-4">
      <span className="text-lg font-bold">Tsuika</span>
      <div className="space-x-2">
        <LayoutPicker />
        <ThemeToggle />
      </div>
    </div>
  );
}
