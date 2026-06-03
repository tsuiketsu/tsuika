import type { Font } from "@/components/font/context/font-context";
import type { Preferences } from "@/types/profile";

type PreferencesAction = { type: "SET_FONT"; payload: Font };

export function preferencesReduces(
  state: Preferences,
  action: PreferencesAction
): Preferences {
  switch (action.type) {
    case "SET_FONT":
      return { ...state, font: action.payload };
    default:
      return state;
  }
}
