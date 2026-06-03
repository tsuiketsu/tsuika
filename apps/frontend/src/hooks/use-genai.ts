import { options } from "@/constants";
import { GoogleGenAI } from "@google/genai";
import { useMemo } from "react";

export default function useGenAI() {
  return useMemo(() => {
    return new GoogleGenAI({
      apiKey: options.genaiApiKey,
    });
  }, []);
}
