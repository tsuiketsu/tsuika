import { getLuminance } from "color2k";

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
