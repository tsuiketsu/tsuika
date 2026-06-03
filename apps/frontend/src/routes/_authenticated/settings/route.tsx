import SectionHeader from "@/components/section-header";
import { Button } from "@/components/ui/button";
import type { LucideIconElement } from "@/types";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
  type LinkComponentProps,
} from "@tanstack/react-router";
import { Shield, SwatchBook, User } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRouteComponent,
});

type NavigationLink = {
  [key: string]: {
    icon: LucideIconElement;
    link: LinkComponentProps;
    title: string;
    description: string;
  };
};

const links = {
  profile: {
    icon: User,
    link: { to: "/settings/profile" },
    title: "Profile",
    description: "Update your name, email, profile photo, and bio",
  },
  account: {
    icon: Shield,
    link: { to: "/settings/account" },
    title: "Account",
    description: "Manage your email, password, and security settings.",
  },
  appearance: {
    icon: SwatchBook,
    link: { to: "/settings/appearance" },
    title: "Theme",
    description:
      "Customize font and theme (light/dark) for a tailored visual experience",
  },
} satisfies NavigationLink;

type NavLinkKey = keyof typeof links;

function SettingsRouteComponent() {
  const [currentPath, setCurrentPath] = useState<NavLinkKey | undefined>(
    undefined
  );

  const {
    location: { pathname },
  } = useRouterState();

  useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/").filter(Boolean);
      const _current = segments[segments.length - 1];

      if (Object.keys(links).includes(_current)) {
        setCurrentPath(_current as NavLinkKey);
      }
    }
  }, [pathname]);

  return (
    <div className="w-full pb-40">
      <SectionHeader
        title="Settings"
        description="Manage your account settings, profile, theme preferences etc."
      >
        <div className="flex size-full flex-col gap-6 @2xl/dash:flex-row @2xl/dash:gap-10">
          <div className="flex w-auto gap-3 @2xl/dash:flex-col @2xl/dash:gap-1">
            {Object.entries(links).map(([_, value], idx) => (
              <Button
                variant="ghost"
                key={`option-nav-${idx}`}
                className="min-w-28 font-normal @xl/dash:min-w-32 @2xl/dash:w-58 @2xl/dash:justify-start"
                asChild
              >
                <Link {...value.link} className="[&.active]:bg-secondary">
                  <value.icon />
                  <span>{value.title}</span>
                </Link>
              </Button>
            ))}
          </div>
          <div className="size-full space-y-6">
            <section>
              {typeof currentPath !== "undefined" && (
                <>
                  <h2 className="text-lg">{links[currentPath].title}</h2>
                  <p className="text-muted-foreground text-sm">
                    {links[currentPath].description}
                  </p>
                </>
              )}
            </section>
            <hr />
            <div className="w-full @xl/dash:max-w-md">
              <Outlet />
            </div>
          </div>
        </div>
      </SectionHeader>
    </div>
  );
}
