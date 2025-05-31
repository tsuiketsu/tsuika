import type { Font } from "@/components/font/context/font-context";

export interface Preferences {
  font: Font;
}

export interface Profile {
  preferencesJson: Preferences;
  createdAt: Date;
  udpatedAt: Date;
}
