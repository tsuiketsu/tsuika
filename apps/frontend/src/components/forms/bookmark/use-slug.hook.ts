import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

export const useBookmarPathSlug = () => {
  const {
    location: { pathname },
  } = useRouterState();

  const slug = useMemo(() => {
    return pathname.split("/").slice(-1).join("/");
  }, [pathname]);

  return { slug: decodeURIComponent(slug) };
};
