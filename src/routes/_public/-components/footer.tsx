import { Button } from "@/components/ui/button";
import { GitMergeIcon, MailIcon } from "lucide-react";

const links = [
  { href: "https://github.com/ImRayy/tsuika", icon: GitMergeIcon },
  { href: "mailto:imrayy.wklem@aleeas.com", icon: MailIcon },
];

export default function Footer() {
  return (
    <div className="mt-24 flex w-full flex-col items-center justify-center gap-4 border-t py-4 sm:flex-row sm:justify-between">
      <div className="inline-flex items-center gap-2">
        <span className="font-bold">Tsuika</span>
        <span className="bg-border mx-2 h-6 w-0.5"></span>
        {links.map((link, idx) => (
          <Button variant="outline" size="icon" key={`social-icon-${idx}`}>
            <link.icon />
          </Button>
        ))}
      </div>
      <span className="text-sm">
        Copyright @ {new Date().getFullYear()} - Tsuika, Made by <b>Ray</b> with
        ❤️ &amp; ⚡️
      </span>
    </div>
  );
}
