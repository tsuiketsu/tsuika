import type { Setter } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function useCmdkToggle(): [boolean, Setter<boolean>] {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return [open, setOpen];
}
