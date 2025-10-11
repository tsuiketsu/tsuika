import { GoogleGenAI } from "@google/genai";
import { useMemo } from "react";

export default function useGenAI() {
  return useMemo(() => {
    return new GoogleGenAI({
      apiKey: import.meta.env.VITE_GENAI_API_KEY,
    });
  }, []);
}
