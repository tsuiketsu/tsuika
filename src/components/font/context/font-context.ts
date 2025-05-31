import { createContext } from "react";

// NOTE: Don't use name as inter, itim, sans alone, use as they're defined
// in index.css, else tailwind will ignore them, that's how tailwind with
// setting dynamic classes
export const fonts = {
  default: "font-inter",
  itim: "font-itim",
  tailwindSans: "font-sans",
  tailwindMono: "font-mono",
  spaceMono: "font-space-mono",
} as const;

export type Font = (typeof fonts)[keyof typeof fonts];

type FontProviderState = {
  font: Font;
  setFont: (font: Font) => void;
};

const initialState: FontProviderState = {
  font: fonts.default,
  setFont: () => null,
};

export const FontProviderContext =
  createContext<FontProviderState>(initialState);
