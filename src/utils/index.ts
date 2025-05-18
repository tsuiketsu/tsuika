import { getLuminance } from "color2k";

export const getTextColor = (bgColor: string) => {
  const luminance = getLuminance(bgColor);

  return luminance > 0.3 ? "#000000" : "#ffffff";
};
