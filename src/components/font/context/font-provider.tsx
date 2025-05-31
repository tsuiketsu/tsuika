import { FontProviderContext, fonts, type Font } from "./font-context";
import { useState, useEffect } from "react";

type FontProviderProps = {
  children: React.ReactNode;
  defaultFont?: Font;
  storageKey?: string;
};

export default function FontProvider({
  children,
  defaultFont = fonts.default,
  storageKey = "vite-ui-font",
  ...props
}: FontProviderProps) {
  const [font, setFont] = useState<Font>(
    () => (localStorage.getItem(storageKey) as Font) || defaultFont
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.forEach((cls) => {
      if (cls.startsWith("font-")) {
        root.classList.remove(cls);
      }

      root.classList.add(font);
    });
  }, [font]);

  const value = {
    font,
    setFont: (font: Font) => {
      localStorage.setItem(storageKey, font);
      setFont(font);
    },
  };

  return (
    <FontProviderContext.Provider {...props} value={value}>
      {children}
    </FontProviderContext.Provider>
  );
}
