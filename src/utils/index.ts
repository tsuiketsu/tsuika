import type { Setter } from "@/lib/utils";
import { getLuminance } from "color2k";
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
