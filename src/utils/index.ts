import type { Setter } from "@/lib/utils";
import { getLuminance } from "color2k";
import { format, parse, parseISO } from "date-fns";
import { toast } from "sonner";

// Constants
const aspectRatios = [
  { width: 1, height: 1 },
  { width: 4, height: 3 },
  { width: 3, height: 2 },
  { width: 3, height: 4 },
  { width: 2, height: 3 },
  { width: 5, height: 4 },
  { width: 4, height: 5 },
  { width: 5, height: 3 },
  { width: 3, height: 5 },
];

export const getTextColor = (bgColor: string) => {
  return getLuminance(bgColor) > 0.3 ? "#000000" : "#ffffff";
};

export const getRandomAspectRatio = (): { width: number; height: number } => {
  return aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
};

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function getAspectRatio(w: number, h: number): [number, number] {
  const divisor = gcd(w, h);
  return [w / divisor, h / divisor];
}

export const getPreviewUrl = (
  file: FileList | File | undefined
): string | null => {
  if (file && file instanceof FileList && file[0] != null) {
    return URL.createObjectURL(file[0]);
  } else if (file && file instanceof File && file != null) {
    return URL.createObjectURL(file);
  }

  return null;
};

export const copyCodes = async (text: string, setState?: Setter<boolean>) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied codes to clipboard");
    setState?.(true);
    setTimeout(() => setState?.(false), 4000);
  } catch (error) {
    toast.error("Failed to copy codes, please try again!");
    console.error(error);
  }
};

export const objectPick = <T, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return Object.fromEntries(keys.map((key) => [key, obj[key]])) as Pick<T, K>;
};

export const mergeOnlyUpdatedFields = <T extends object>(
  update: Partial<T>,
  current: T
): Partial<T> => {
  const result: Partial<T> = { ...current };
  for (const key in update) {
    if (key == null) {
      delete result[key];
    } else {
      result[key] = update[key];
    }
  }

  return result;
};

export const combineDateAndTime = ({
  date,
  time,
}: {
  date: string;
  time: string;
}): Date => {
  const dateOnly = format(parseISO(date), "yyyy-MM-dd");
  return parse(`${dateOnly} ${time}`, "yyyy-MM-dd HH:mm:ss", new Date());
};

export const splitDateAndTime = (dateISO: string) => {
  const dateObj = parseISO(dateISO);
  return {
    date: format(dateObj, "yyyy-MM-dd"),
    time: format(dateObj, "HH:mm:ss"),
  };
};

export function createTypedWorkerPost<T>(worker: Worker) {
  return (data: T) => worker.postMessage(data);
}

export const getFavIcon = (url: string) => {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=128`;
};

export const isDefaultFolder = (slug: string): boolean => {
  return ["all", "favorites", "archived", "unsorted"].includes(
    decodeURIComponent(slug).split("/").slice(-1)[0] ?? ""
  );
};
